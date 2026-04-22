export interface DemoRunner<TInput, TOutput> {
  name: string;
  run(input: TInput): Promise<TOutput>;
  validateInput(input: unknown): TInput;
  isAvailable(): Promise<boolean>;
}
