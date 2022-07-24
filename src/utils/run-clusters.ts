import cluster from 'cluster'
import { cpus } from 'os'

export function runClusters(
  bootstrap: () => Promise<void>
) {
  const numberOfCores = cpus().length;

  if (cluster?.isMaster) {
    for (let i = 0; i < numberOfCores; ++i) {
      cluster.fork();
    }
  } else {
    void bootstrap();
  }
}

