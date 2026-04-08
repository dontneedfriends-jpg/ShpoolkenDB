import { useTranslation } from '../i18n'

export default function About() {
  const { t } = useTranslation()

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        {t.about.title}
      </h1>

      <div className="space-y-6 text-gray-600 dark:text-gray-400">
        <p className="text-lg leading-relaxed">
          {t.about.p1}
        </p>

        <div className="bg-violet-50 dark:bg-violet-900/20 rounded-xl p-6 border border-violet-100 dark:border-violet-800">
          <h2 className="text-xl font-semibold mb-3 text-violet-700 dark:text-violet-300">
            {t.about.problemTitle}
          </h2>
          <p className="mb-4">{t.about.problem}</p>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 border border-green-100 dark:border-green-800">
          <h2 className="text-xl font-semibold mb-3 text-green-700 dark:text-green-300">
            {t.about.solutionTitle}
          </h2>
          <p>{t.about.solution}</p>
        </div>

        <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">
          {t.about.statsTitle}
        </h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-violet-600 dark:text-violet-400">59</div>
            <div className="text-sm">{t.about.manufacturers}</div>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-violet-600 dark:text-violet-400">7000+</div>
            <div className="text-sm">{t.about.filaments}</div>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-violet-600 dark:text-violet-400">33</div>
            <div className="text-sm">{t.about.prs}</div>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-100 dark:border-blue-800 mt-8">
          <h2 className="text-xl font-semibold mb-3 text-blue-700 dark:text-blue-300">
            {t.about.printpalTitle}
          </h2>
          <p className="mb-4">{t.about.printpal}</p>
          <a
            href="https://github.com/dontneedfriends-jpg/printpal"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            github.com/dontneedfriends-jpg/printpal
          </a>
          <p className="mt-4 text-sm italic">{t.about.printpalNote}</p>
        </div>

        <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">
          {t.about.techTitle}
        </h2>
        <p>{t.about.tech}</p>

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-500">
            {t.about.license}
          </p>
        </div>
      </div>
    </div>
  )
}