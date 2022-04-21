const fs = require('fs');
const child_process = require('child_process');
const path = require('path');

function isGitDir(dir) {
  return fs.existsSync(path.join(dir, '.git'));
}

function getDirectories(dir) {
  return fs.readdirSync(dir).filter((file) => {
    const dirPath = fs.statSync(path.join(dir, file));
    return dirPath.isDirectory() && (file !== '.git');
  });
}

let [, , absoluteDir = __dirname] = process.argv;
const dirs = getDirectories(absoluteDir);
dirs.forEach((dir) => {
  const actualDir = path.join(absoluteDir, dir);
  if (isGitDir(actualDir)) {
    process.chdir(actualDir);
    child_process.exec(`git pull`, { encoding: 'utf-8' },
      (error, stdout, stderr) => {
        if (error) {
          console.log(actualDir, '-->', stderr.replaceAll('\n', ''));
        } else {
          console.log(actualDir, '-->', stdout.replaceAll('\n', ''));
        }
      });
  }
});