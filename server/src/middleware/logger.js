/**
 * 请求日志中间件
 */
const logger = (req, res, next) => {
  const start = Date.now();

  // 记录请求
  console.log(`➡️  [${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);

  // 响应完成后记录
  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusColor = res.statusCode >= 400 ? '\x1b[31m' : '\x1b[32m';
    const resetColor = '\x1b[0m';

    console.log(
      `⬅️  [${new Date().toISOString()}] ${req.method} ${req.originalUrl} ` +
      `${statusColor}${res.statusCode}${resetColor} - ${duration}ms`
    );
  });

  next();
};

module.exports = logger;
