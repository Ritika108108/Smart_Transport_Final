"use strict";
import fs from 'fs';
import * as XLSX from "xlsx";
import * as path from 'path';
import multer from 'multer';
import archiver from 'archiver';
import csvParse from 'csv-parse';
const awsS3Bucket = require("../utilities/awsS3Bucket.service");

// Set up multer storage
const storage = multer.diskStorage({
    destination: (req:any, file:any, cb:any) => {
        const uploadPath = path.join(__dirname, '..', 'uploads'); // Path where files will be stored
        fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath); // Store files in 'uploads' folder
    },
    filename: (req:any, file:any, cb:any) => {
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + ext); // Generate a unique filename
    }
});

// Create multer upload middleware
const upload = multer({ storage }).array('file', 10); // Allow up to 10 files

// Middleware to handle form data and file upload
const parseFormData = async (req: any): Promise<{ fields: any; files: { filepath: string; originalFilename: string }[] }> => {
    return new Promise((resolve, reject) => {
        upload(req, req.res, (err: any) => {
            if (err) {
                reject(err);
                return;
            }
            // Normalize fields from the body (e.g., user_id, organization_id)
            const normalizedFields: { [key: string]: any } = {};
            for (const key in req.body) {
                normalizedFields[key] = Array.isArray(req.body[key]) ? req.body[key][0] : req.body[key];
            }

            // Extract files from the uploaded files array
            let fileArray: { filepath: string; originalFilename: string }[] = [];
            if (Array.isArray(req.files)) {
                fileArray = req.files.map((file: any) => ({
                    filepath: file.path,
                    originalFilename: file.originalname,
                }));
            }
             console.log("MULTER---------->")
            resolve({
                fields: normalizedFields,
                files: fileArray,
            });
        });
    });
};

const parseCSVFile = async (filePath: string): Promise<any[]> => {
    return new Promise((resolve, reject) => {
        const records: any[] = [];
        const stream = fs.createReadStream(filePath);

        const parser = stream.pipe(csvParse.parse({ columns: true }));

        parser.on("data", (record: any) => {
            records.push(record);
        });

        parser.on("end", () => {
            resolve(records);
        });

        parser.on("error", (error: any) => {
            reject(error);
        });
    });
};

const parseExcelFile = async (filepath: string): Promise<any[]> => {
    try {
        const workbook = XLSX.readFile(filepath);
        const sheetNames = workbook.SheetNames;
        const firstSheet = sheetNames[0];
        const data = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheet]);
        return data;
    } catch (error) {
        console.error("Error parsing Excel file:", error);
        throw error;
    }
};

const createOutputFile = (data: any[], outputDirectory: string, fileName: string): string => {
    try {
        if (!fs.existsSync(outputDirectory)) {
            fs.mkdirSync(outputDirectory, { recursive: true });
        }

        const outputFilePath = path.join(outputDirectory, fileName);
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'ProcessedData');
        XLSX.writeFile(workbook, outputFilePath);

        console.log(`Output file created: ${outputFilePath}`);
        return outputFilePath;
    } catch (error: any) {
        console.error('Error creating output file:', error.message);
        throw error;
    }
};

const deleteFile = async (filePath: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error(`Failed to delete file: ${filePath}`, err);
                reject(err);
            } else {
                console.log(`File deleted: ${filePath}`);
                resolve();
            }
        });
    });
};

const createZipFile = (files: string[], file_path: string) => {
    return new Promise<void>((resolve, reject) => {
        const output = fs.createWriteStream(file_path);
        const archive = archiver('zip', { zlib: { level: 9 } });

        output.on('close', resolve);
        archive.on('error', reject);

        archive.pipe(output);
        files.forEach((file) => {
            const fileName = path.basename(file);
            archive.file(file, { name: fileName });
        });

        archive.finalize();
    });
};

export default {
    parseFormData,
    parseCSVFile,
    parseExcelFile,
    deleteFile,
    createOutputFile,
    createZipFile:createZipFile
};
