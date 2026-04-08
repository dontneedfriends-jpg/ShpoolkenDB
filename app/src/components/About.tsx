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
            <div className="text-2xl font-bold text-violet-600 dark:text-violet-400">4000+</div>
            <div className="text-sm">{t.about.filaments}</div>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-violet-600 dark:text-violet-400">33</div>
            <div className="text-sm">{t.about.prs}</div>
          </div>
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