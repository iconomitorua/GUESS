/**
 * 404 错误处理
 */
exports.notFound = (req, res, next) => {
  res.status(404).json({
    code: 404000,
    message: 'NOT_FOUND',
    result: {
      code: 404000,
      message: `接口不存在: ${req.originalUrl}`
    }
  });
};

/**
 * 全局错误处理
 */
exports.errorHandler = (err, req, res, next) => {
  console.error('❌ 服务器错误:', err);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    code: statusCode * 1000,
    message: 'ERROR',
    result: {
      code: statusCode * 1000,
      message: err.message || '服务器内部错误'
    },
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};
