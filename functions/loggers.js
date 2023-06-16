import chalk from "chalk";

export function reqLog(...args) {
  for (let i = 0; i < args.length; i++) {
    console.log(`${chalk.yellow([args[i]])}`);
  }
}

export function assetsLog(str, color = 'black') {
    if(color === 'blue') console.log(chalk.blue(str));
    if(color === 'red') console.log(chalk.red(str));
    if(color === 'green') console.log(chalk.green(str));
    if(color === 'yellow') console.log(chalk.yellow(str));
    
  
}
