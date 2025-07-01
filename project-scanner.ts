import * as fs from 'fs-extra';
import * as path from 'path';
import { glob } from 'glob';

interface ProjectStructure {
    name: string;
    description: string;
    technologies: string[];
    database: {
        type: string;
        filePath?: string;
        models?: ModelDefinition[];
    };
    apiEndpoints: EndpointDefinition[];
    files: FileDetail[];
    dependencies: { [key: string]: string };
}

interface ModelDefinition {
    name: string;
    filePath: string;
    attributes: { [key: string]: string }; // Ví dụ: { "id": "INTEGER PRIMARY KEY", "name": "TEXT" }
    relations: { [key: string]: string }; // Ví dụ: { "hasMany": "Product" }
}

interface EndpointDefinition {
    path: string;
    method: string;
    controller: string;
    description?: string;
    parameters?: string[];
    response?: string;
}

interface FileDetail {
    path: string;
    type: 'directory' | 'file';
    contentSnippet?: string; // Đoạn code nhỏ nếu cần
}

async function scanProject(projectRoot: string): Promise<ProjectStructure> {
    const projectStructure: ProjectStructure = {
        name: path.basename(projectRoot),
        description: "Mô tả dự án Express.js với SQLite và TypeScript.",
        technologies: ['Express.js', 'SQLite', 'TypeScript', 'Node.js'],
        database: {
            type: 'SQLite',
            filePath: '',
            models: []
        },
        apiEndpoints: [],
        files: [],
        dependencies: {}
    };

    // 1. Đọc package.json để lấy thông tin dependencies
    try {
        const packageJsonPath = path.join(projectRoot, 'package.json');
        if (await fs.pathExists(packageJsonPath)) {
            const packageJson = await fs.readJson(packageJsonPath);
            projectStructure.name = packageJson.name || projectStructure.name;
            projectStructure.description = packageJson.description || projectStructure.description;
            projectStructure.dependencies = {
                ...packageJson.dependencies,
                ...packageJson.devDependencies
            };
        }
    } catch (error) {
        console.warn(`Không đọc được package.json: ${error}`);
    }

    // 2. Tìm kiếm file database SQLite
    const sqliteDbPath = await glob(path.join(projectRoot, '**/*.sqlite'), { ignore: 'node_modules/**', cwd: projectRoot });
    if (sqliteDbPath.length > 0) {
        projectStructure.database.filePath = path.relative(projectRoot, sqliteDbPath[0]);
    }

    // 3. Quét các file và thư mục chính
    const importantPaths = [
        'src/controllers/**/*.ts',
        'src/models/**/*.ts',
        'src/routes/**/*.ts',
        'src/services/**/*.ts',
        'src/utils/**/*.ts',
        'src/app.ts',
        'src/server.ts',
        'src/',
        'package.json',
        'tsconfig.json',
        'README.md'
    ];

    for (const pattern of importantPaths) {
        const files = await glob(pattern, { ignore: 'node_modules/**', cwd: projectRoot });
        for (const file of files) {
            const fullPath = path.join(projectRoot, file);
            const stats = await fs.stat(fullPath);
            if (stats.isDirectory()) {
                projectStructure.files.push({ path: file, type: 'directory' });
            } else {
                const fileContent = await fs.readFile(fullPath, 'utf-8');
                projectStructure.files.push({
                    path: file,
                    type: 'file',
                    contentSnippet: fileContent.substring(0, Math.min(fileContent.length, 200)) + '...' // Lấy 200 ký tự đầu
                });
                // Phân tích sâu hơn cho các loại file cụ thể
                if (file.includes('routes') && file.endsWith('.ts')) {
                    // Cố gắng phân tích các route Express (đơn giản)
                    const routeMatches = [...fileContent.matchAll(/(app|router)\.(get|post|put|delete|patch)\(['"]([^'"]+)['"]/g)];
                    routeMatches.forEach(match => {
                        projectStructure.apiEndpoints.push({
                            path: match[3],
                            method: match[2].toUpperCase(),
                            controller: path.basename(file, '.ts') // Tên file route
                        });
                    });
                }
                if (file.includes('models') && file.endsWith('.ts')) {
                    // Cố gắng phân tích các model (rất đơn giản, cần parser AST thực sự cho độ chính xác cao)
                    const classNameMatch = fileContent.match(/class\s+(\w+)\s+extends\s+(Model|DataTypes)/);
                    if (classNameMatch) {
                        const modelName = classNameMatch[1];
                        const attributes: { [key: string]: string } = {};
                        const attributeMatches = [...fileContent.matchAll(/(\w+):\s*(\w+);?\s*\/\/\s*(\w+)/g)]; // Tìm kiếm comment
                        attributeMatches.forEach(match => {
                            attributes[match[1]] = match[2]; // VD: { name: "string" }
                        });
                         projectStructure.database.models?.push({
                            name: modelName,
                            filePath: path.relative(projectRoot, fullPath),
                            attributes: attributes,
                            relations: {} // Cần phân tích sâu hơn cho quan hệ
                        });
                    }
                }
            }
        }
    }

    return projectStructure;
}

async function generateJsonOutput(projectPath: string, outputPath: string = 'project_structure.json') {
    console.log(`Đang quét dự án tại: ${projectPath}`);
    const structure = await scanProject(projectPath);
    await fs.writeJson(outputPath, structure, { spaces: 4 });
    console.log(`Đã xuất cấu trúc dự án ra: ${outputPath}`);
}

// Cách sử dụng:
// Chạy từ thư mục gốc của dự án:
// ts-node your-script.ts
// Hoặc cung cấp đường dẫn:
// ts-node project-scanner.ts D:/my-express-project

const args = process.argv.slice(2);
const targetPath = args[0] || process.cwd(); // Mặc định là thư mục hiện tại

generateJsonOutput(targetPath).catch(console.error);