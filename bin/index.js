#!/usr/bin/env node

const fs = require('fs');
const program = require('commander');
const download = require('download-git-repo');
const handlebars = require('handlebars');
const inquirer = require('inquirer');
const chalk = require('chalk');
const symbols = require('log-symbols');

program.version('1.1.0', '-v, --version')
    .command('init <name>')
    .action((name) => {
        //判断项目名称是否存在
        if(!fs.existsSync(name)){
            inquirer.prompt([
                {
                    name: 'description',
                    message: '请输入项目描述'
                },
                {
                    name: 'author',
                    message: '请输入作者名称'
                }
            ]).then((answers) => {
                console.log(symbols.success,'正在下载模板...');
                //下载
                download('direct:https://github.com/jimi-web/locator.git', name, {clone: true}, (err) => {
                    if(err){
                        console.log(symbols.error, chalk.red(err));
                    }else{
                        //如果成功则将配置写入json文件里
                        const fileName = `${name}/package.json`;
                        const meta = {
                            name,
                            description: answers.description,
                            author: answers.author
                        };
                        if(fs.existsSync(fileName)){
                            const content = fs.readFileSync(fileName).toString();
                            const result = handlebars.compile(content)(meta);
                            fs.writeFileSync(fileName, result);
                        }
                        console.log(symbols.success, chalk.green('项目初始化完成'));
                    }
                });
            });
        }else{
            // 错误提示项目已存在，避免覆盖原有项目
            console.log(symbols.error, chalk.red('项目已存在'));
        }
    });
program.parse(process.argv);