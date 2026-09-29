import React, { useState } from 'react';
import { DJANGO_CODEBASE_FILES, DJANGO_SETUP_STEPS, DjangoFile } from '../data/djangoCodebase';
import JSZip from 'jszip';
import {
  Code2,
  FolderTree,
  Download,
  Copy,
  Check,
  Terminal,
  Database,
  ExternalLink,
  Layers,
  FileCode,
  Sparkles
} from 'lucide-react';

export const DjangoExportHub: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<DjangoFile>(DJANGO_CODEBASE_FILES[1]); // Default to settings.py
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const [isGeneratingZip, setIsGeneratingZip] = useState(false);
  const [activeTab, setActiveTab] = useState<'guide' | 'code' | 'tree'>('guide');

  const handleCopyCode = (text: string, identifier: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFile(identifier);
    setTimeout(() => setCopiedFile(null), 2500);
  };

  const handleDownloadZip = async () => {
    try {
      setIsGeneratingZip(true);
      const zip = new JSZip();

      // Add each file into appropriate folders
      DJANGO_CODEBASE_FILES.forEach((f) => {
        zip.file(f.path, f.code);
      });

      // Add manage.py
      zip.file(
        'manage.py',
        `#!/usr/bin/env python
import os
import sys

def main():
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'shopease.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)

if __name__ == '__main__':
    main()
`
      );

      // Add README.md
      zip.file(
        'README.md',
        `# ShopEase – Online E-Commerce Store
Built with **Python**, **Django**, **MySQL**, and **Bootstrap 5**.

## Quick Start
1. Create virtual environment:
   \`python -m venv venv\`
   \`source venv/bin/activate\` (or \`venv\\Scripts\\activate\` on Windows)

2. Install dependencies:
   \`pip install -r requirements.txt\`

3. Configure MySQL:
   Create a database named \`shopease_db\` in MySQL and update password in \`shopease/settings.py\`.

4. Run migrations:
   \`python manage.py makemigrations store\`
   \`python manage.py migrate\`

5. Create admin account:
   \`python manage.py createsuperuser\`

6. Start Django development server:
   \`python manage.py runserver\`
`
      );

      // Generate blob
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'shopease_django_mysql_project.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to generate project zip', err);
    } finally {
      setIsGeneratingZip(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Hero Header */}
      <div className="p-8 rounded-3xl bg-slate-900 text-white shadow-2xl relative overflow-hidden border border-slate-800">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono font-semibold border border-emerald-500/30">
            <Database className="w-3.5 h-3.5" />
            <span>Python 3.11+ · Django 5.x · MySQL · Bootstrap 5</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Complete Django & MySQL Project Codebase
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Everything needed to run the authentic <strong>ShopEase</strong> backend locally or deploy
            it to production: models, views, forms, authentication, shopping cart, checkout,
            admin configuration, templates, and MySQL schemas.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={handleDownloadZip}
              disabled={isGeneratingZip}
              className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>{isGeneratingZip ? 'Packaging Zip...' : 'Download Complete Project (.zip)'}</span>
            </button>

            <button
              onClick={() => setActiveTab('code')}
              className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm border border-white/20 transition-all flex items-center gap-2"
            >
              <Code2 className="w-4 h-4" />
              <span>Browse 15+ Source Files</span>
            </button>
          </div>
        </div>

        {/* Ambient watermark */}
        <div className="absolute right-6 -bottom-8 opacity-10 text-white pointer-events-none hidden md:block">
          <Terminal className="w-80 h-80" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('guide')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'guide'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>Step-by-Step Setup Guide</span>
        </button>

        <button
          onClick={() => setActiveTab('code')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'code'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileCode className="w-4 h-4" />
          <span>Interactive Code Viewer</span>
        </button>

        <button
          onClick={() => setActiveTab('tree')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'tree'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FolderTree className="w-4 h-4" />
          <span>Project Structure Tree</span>
        </button>
      </div>

      {/* TAB 1: Step-by-Step Setup Guide */}
      {activeTab === 'guide' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {DJANGO_SETUP_STEPS.map((s) => (
              <div
                key={s.step}
                className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3 relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-xl bg-indigo-600 text-white font-mono font-bold text-xs flex items-center justify-center">
                      {s.step}
                    </span>
                    <h3 className="font-bold text-slate-900 text-base">{s.title}</h3>
                  </div>
                  <button
                    onClick={() => handleCopyCode(s.command, `step-${s.step}`)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                    title="Copy command"
                  >
                    {copiedFile === `step-${s.step}` ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <p className="text-xs text-slate-600">{s.description}</p>

                <div className="p-3 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto whitespace-pre leading-relaxed">
                  {s.command}
                </div>
              </div>
            ))}
          </div>

          {/* MySQL Configuration Callout */}
          <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-2">
            <h4 className="font-bold text-sm flex items-center gap-2 text-amber-800">
              <Database className="w-4 h-4" />
              MySQL Driver Tip for Windows / Mac / Linux
            </h4>
            <p className="text-xs leading-relaxed text-amber-900/90">
              On Ubuntu/Debian, install the client headers first:{' '}
              <code className="bg-amber-100 px-1 py-0.5 rounded font-mono font-bold">
                sudo apt-get install python3-dev default-libmysqlclient-dev build-essential
              </code>
              . On Windows,{' '}
              <code className="bg-amber-100 px-1 py-0.5 rounded font-mono font-bold">
                pip install mysqlclient
              </code>{' '}
              uses precompiled binary wheels. Alternatively, you can use{' '}
              <code className="bg-amber-100 px-1 py-0.5 rounded font-mono font-bold">
                pymysql
              </code>{' '}
              with <code className="font-mono">pymysql.install_as_MySQLdb()</code>.
            </p>
          </div>
        </div>
      )}

      {/* TAB 2: Interactive Code Viewer */}
      {activeTab === 'code' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* File selector list */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-2 max-h-[600px] overflow-y-auto">
            <div className="px-2 py-1 text-xs font-bold text-slate-400 uppercase tracking-wider">
              Project Files
            </div>

            {DJANGO_CODEBASE_FILES.map((f) => {
              const isSelected = selectedFile.path === f.path;
              return (
                <button
                  key={f.path}
                  onClick={() => setSelectedFile(f)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs font-medium transition-all flex flex-col gap-0.5 ${
                    isSelected
                      ? 'bg-indigo-50 border border-indigo-200 text-indigo-900 font-bold'
                      : 'hover:bg-slate-50 text-slate-700 border border-transparent'
                  }`}
                >
                  <span className="font-mono flex items-center justify-between">
                    <span>{f.path}</span>
                    <span className="text-[10px] text-slate-400 font-normal uppercase">
                      {f.category}
                    </span>
                  </span>
                  <span className="text-[11px] text-slate-500 font-normal truncate">
                    {f.description}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active File Code Viewer */}
          <div className="lg:col-span-8 bg-slate-950 rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex flex-col">
            <div className="px-5 py-3.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-slate-300">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-emerald-400" />
                <span className="font-mono text-xs font-bold text-slate-100">
                  {selectedFile.path}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyCode(selectedFile.code, selectedFile.path)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  {copiedFile === selectedFile.path ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="p-5 overflow-x-auto max-h-[550px] overflow-y-auto">
              <pre className="text-xs font-mono text-slate-200 leading-relaxed">
                <code>{selectedFile.code}</code>
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Project Structure Tree */}
      {activeTab === 'tree' && (
        <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-lg">ShopEase Django Project Architecture</h3>
          <p className="text-xs text-slate-500">
            A clean, modular layout following official Django best practices:
          </p>

          <div className="p-6 rounded-xl bg-slate-950 text-slate-300 font-mono text-xs leading-relaxed overflow-x-auto whitespace-pre">
{`shopease_project/
├── manage.py                       # Django CLI management script
├── requirements.txt                # Python dependencies
├── schema.sql                      # MySQL schema initialization
├── shopease/                       # Main Project Configuration
│   ├── __init__.py
│   ├── settings.py                 # MySQL, static, media, apps config
│   ├── urls.py                     # Root routing
│   ├── asgi.py
│   └── wsgi.py
├── store/                          # E-Commerce Application App
│   ├── __init__.py
│   ├── admin.py                    # Django Admin models, inlines, actions
│   ├── apps.py                     # App configuration
│   ├── forms.py                    # Registration, checkout & profile forms
│   ├── models.py                   # Category, Product, Cart, Order, Profile
│   ├── urls.py                     # App-level routing
│   ├── views.py                    # Catalog, cart, checkout & auth controllers
│   ├── context_processors.py       # Global cart badge & category items
│   └── migrations/                 # Database migrations folder
├── templates/                      # HTML5 & Bootstrap 5 Templates
│   ├── base.html                   # Master template with CDN and alerts
│   ├── includes/
│   │   ├── navbar.html             # Responsive navbar with search
│   │   └── footer.html             # Footer with newsletter and links
│   └── store/
│       ├── home.html               # Hero banner, featured, categories
│       ├── shop.html               # Product list, filters, price slider
│       ├── product_detail.html     # Gallery, specs, reviews, related
│       ├── cart.html               # Cart items, coupon, subtotal
│       ├── checkout.html           # Shipping, payments, order summary
│       ├── order_success.html      # Confirmation & order number
│       ├── order_history.html      # Orders tracking timeline
│       ├── login.html              # Authentication sign in
│       ├── register.html           # Account creation
│       └── profile.html            # Profile info & change password
├── static/                         # Static Assets
│   ├── css/
│   │   └── style.css               # Custom responsive styles & badges
│   └── js/
│       └── main.js                 # Cart modifiers & interactive scripts
└── media/                          # Uploaded Product Images & Avatars
    ├── products/
    ├── categories/
    └── avatars/`}
          </div>
        </div>
      )}
    </div>
  );
};
