import type { Config } from '@jest/types';
const config: Config.InitialOptions = {
    moduleFileExtensions: ['ts', 'js'],
    testMatch: ['<rootDir>/**/*.test.(js|ts)'], //test할 폴더등을 정해서 그녀석들만 돌리게 설정하는부분
    moduleNameMapper: {
        // 별칭
        '^@core/(.*)$': '<rootDir>/src/core/$1',
    },
    testEnvironment: 'node',
    verbose: true, //console.log를 고급지게 찍어주는 녀석
    preset: 'ts-jest',
};

export default config;
