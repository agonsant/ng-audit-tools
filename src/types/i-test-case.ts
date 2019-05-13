import { IContext } from './i-context';

interface TestCase {
    description: string
    run(context: IContext): Promise<string>
}

export type ITestCase = TestCase;