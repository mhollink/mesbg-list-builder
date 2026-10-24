// Keep this scope list synchronized with CONTRIBUTING.md.
const scopes = [
    'frontend',
    'backend',
    'api',
    'data',
    'e2e',
    'infra',
    'ci',
    'release',
    'deps',
    'docs',
    'tooling',
    'builder',
    'rosters',
    'collection',
    'games',
    'tournaments',
    'reference',
    'auth',
    'profiles',
    'rules',
    'armies',
    'account',
    'navigation',
    'theme'
];

export default {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'type-enum': [
            2,
            'always',
            ['feat', 'fix', 'fixup', 'perf', 'change', 'refactor', 'docs', 'test', 'style', 'build', 'ci', 'chore', 'revert'],
        ],
        'scope-empty': [2, 'never'],
        // Commitlint splits comma-separated scopes and validates each item individually.
        'scope-enum': [2, 'always', scopes],
    },
};
