import type { Task } from 'fp-ts/lib/Task';

export const runTask = async <A>(task: Task<A>): Promise<A> => task();

export async function runTaskAsVoid<A>(task: Task<A>): Promise<void> {
  await runTask(task);
}
