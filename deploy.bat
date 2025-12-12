@echo off
echo Building StuDex for production...
npm run build

echo Deploying to Vercel...
npx vercel --prod

echo Deployment complete!
pause