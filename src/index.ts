export const start = async () => {
  const requiredEnvVars = [
    'PORT',
    'DATABASE_URL',
    'JWT_SECRET',
    'JWT_EXPIRES_IN_DAYS',
    'MIN_PASSWORD_LENGTH',
    'MIN_PASSWORD_LENGTH',
  ];

  const missingEnvVars = requiredEnvVars.filter(
    (envVar) => !process.env[envVar],
  );

  if (missingEnvVars.length > 0) {
    throw new Error(
      `These environment variables must be defined:\n ${missingEnvVars.join(
        '\n',
      )}`,
    );
  }
};
