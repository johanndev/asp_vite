# ASP.NET Core Vite Integration

This sample was built using .NET SDK 6.0.100-preview.6.21351.1
---

1. Create a new ASP.NET Core Angular Project
	`dotnet new angular -o asp_vite`
	
2. In the `ClientApp` Folder, save the contents of `aspnetcore-https.js` (or copy the file to somewhere outside of the `ClientApp` folder).

3. Create the vite app, choose overwrite target directory and choose the same package name you selected during the creation of the ASP.NET Core project:
	```
	npm init @vitejs/app ClientApp --template vue-ts
	npx: installed 6 in 1.6s
	√ Target directory "ClientApp" is not empty. Remove existing files and continue? ... yes
	√ Package name: ... asp_vite
	```

4. Restore `aspnetcore-https.js` to the ClientApp directory.

5. Replace the contents of `vite.config.ts` with:
```
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { readFileSync } from 'fs'
import { join } from 'path';

const baseFolder =
  process.env.APPDATA !== undefined && process.env.APPDATA !== ''
    ? `${process.env.APPDATA}/ASP.NET/https`
    : `${process.env.HOME}/.aspnet/https`;

const certificateName = process.env.npm_package_name

const certFilePath = join(baseFolder, `${certificateName}.pem`);
const keyFilePath = join(baseFolder, `${certificateName}.key`);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    https: {
      key: readFileSync(keyFilePath),
      cert: readFileSync(certFilePath)
    },
    port: 5002,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'https://localhost:5001/',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
```

6. Add new start scripts to `package.json`:
```
"scripts": {
	"prestart": "node ./aspnetcore-https.js", // <--- ADD
	"start": "vite --debug",				  // <--- ADD
	"dev": "vite",
	"build": "vue-tsc --noEmit && vite build",
	"serve": "vite preview"
}
```

7. Run `npm install` in the `ClientApp` folder

8. Back in project directory start the server with `dotnet run`

9. Navigate to `https://localhost:5001/` and observe your beautiful ASP.NET Core + Vite App 😎