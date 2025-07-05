# 🖼️ Image Tools Suite

A modern, fast, and beautiful web application for image processing. Convert images to WebP format and remove backgrounds using AI. Built with Next.js, TypeScript, and optimized for performance.

![Demo](https://img.shields.io/badge/Demo-Live-brightgreen) ![Docker](https://img.shields.io/badge/Docker-Ready-blue) ![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Features

### 🔄 WebP Conversion
- **🚀 Fast Conversion**: Lightning-fast image processing using Sharp.js
- **📦 Bulk Processing**: Upload ZIP files for batch conversion
- **💾 Space Saving**: Reduce image sizes by up to 80% while maintaining quality

### ✂️ AI Background Removal
- **🤖 AI Powered**: Advanced machine learning for precise background removal
- **⚡ Instant Results**: Process images in seconds using client-side AI
- **🎯 High Quality**: Professional results for portraits, products, and objects

### 🌟 General Features
- **🎨 Clean UI**: Minimalist interface with responsive design
- **📱 Mobile Friendly**: Works perfectly on all devices
- **🔒 Privacy First**: All processing happens in your browser
- **⬇️ Easy Download**: Download individual files or bulk ZIP
- **🐳 Docker Ready**: Containerized for easy deployment

## 🚀 Quick Start

### Using Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/revanp/image-to-webp.git
cd image-to-webp

# Build and run with Docker Compose
docker-compose up -d

# Or build and run manually
docker build -t image-to-webp .
docker run -p 3000:3000 image-to-webp
```

### Local Development

```bash
# Clone the repository
git clone https://github.com/revanp/image-to-webp.git
cd image-to-webp

# Install dependencies (using Bun - recommended)
bun install
# or with npm
npm install

# Run the development server
bun dev
# or with npm
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📋 How to Use

### 🔄 WebP Conversion (`/`)
1. **Single Images**: Drag & drop individual images or click to browse
2. **Bulk Upload**: Upload a ZIP file containing multiple images
3. **Convert**: Watch as your images are converted to WebP format
4. **Download**: Get individual files or download all as a ZIP

### ✂️ Background Removal (`/remove-bg`)
1. **Upload Images**: Drag & drop photos or click to browse
2. **AI Processing**: Watch as AI removes backgrounds automatically
3. **Preview Results**: See before/after comparison with transparent backgrounds
4. **Download PNG**: Get high-quality PNG files with transparent backgrounds

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Runtime**: Bun (recommended) or Node.js
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Image Processing**: Sharp.js
- **AI Background Removal**: @imgly/background-removal
- **File Handling**: react-dropzone + JSZip
- **Containerization**: Docker with multi-stage builds

## 📁 Supported Formats

**Input formats:**
- JPEG (.jpg, .jpeg)
- PNG (.png)
- GIF (.gif)
- BMP (.bmp)
- TIFF (.tiff)
- WebP (.webp)
- ZIP files containing images

**Output format:**
- WebP with optimized quality (80%) and compression

## 🎯 Performance

- **Quality**: 80% (optimal balance between size and quality)
- **Compression**: High effort compression for maximum space savings
- **File Size Limit**: 50MB per image
- **Batch Processing**: Unlimited images per ZIP file
- **Runtime**: Optimized with Bun for faster performance

## 🐳 Docker Configuration

The application includes production-ready Docker configuration:

- **Multi-stage build** for optimized image size
- **Bun runtime** for better performance
- **Health checks** for container monitoring
- **Non-root user** for security
- **Standalone Next.js output** for minimal dependencies

### Environment Variables

```bash
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
PORT=3000
HOSTNAME=0.0.0.0
```

## 🌟 Why WebP?

WebP is a modern image format that provides:
- **Superior compression**: 25-80% smaller than JPEG/PNG
- **Better quality**: Maintains visual quality at smaller sizes
- **Universal support**: Supported by all modern browsers
- **Faster loading**: Improves website performance

## 🚀 Deployment

### Deploy with Docker

```bash
# Production build
docker build -t image-to-webp .
docker run -d -p 3000:3000 --name image-converter image-to-webp
```

### Deploy to Cloud

The application is ready for deployment on:
- **Vercel** (recommended for Next.js)
- **Docker-based platforms** (Railway, Render, etc.)
- **VPS with Docker**
- **Kubernetes clusters**

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

This project is **not open for contributions**, but feel free to **fork the repository** and create your own version! If you found this useful, please consider starring the repo.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Sharp](https://sharp.pixelplumbing.com/) - High performance image processing
- [Bun](https://bun.sh/) - Fast all-in-one JavaScript runtime
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [react-dropzone](https://react-dropzone.js.org/) - File upload components

---

Made with ❤️ by [Revan Pratama](https://revanpratamas.com)

*Available at [image-to-webp.revanpratamas.com](https://image-to-webp.revanpratamas.com)*
