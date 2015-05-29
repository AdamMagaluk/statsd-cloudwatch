{
  port: 8125,
  flushInterval: Number(process.env.FLUSH_INTERVAL || 30000),
  backends: [ "./backends/statsd-cloudwatch-backend" ],
  keyNameSanitize: false,
  deleteGauges: true,
  deleteTimers: true,
  deleteCounters: true,
  cloudwatch: {
    namespace:  process.env.CLOUDWATCH_NAMESPACE || 'test.app',
    region: process.env.AWS_REGION,
    dimensions: { },
    accessKeyId:  process.env.AWS_KEY_ID,
    secretAccessKey: process.env.AWS_KEY
  }
}
