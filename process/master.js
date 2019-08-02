const cluster = require('cluster');
let cpus = require('os').cpus().length;

if (cluster.isMaster) {
  console.log('forking for ', cpus, ' CPUS');
  for (let i = 0; i < cpus; i++) {
    cluster.fork();  // 创建多进程
  }
} else {
  require('./worker')
}
