import schedule from 'node-schedule'

const getRemainingTimeInSeconds = (job: schedule.Job): number => {
  const now = new Date()
  const nextRun = job.nextInvocation()
  if (!nextRun) return 0
  return Math.ceil((nextRun.getTime() - now.getTime()) / 1000)
}

export default getRemainingTimeInSeconds
