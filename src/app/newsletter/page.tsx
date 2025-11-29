import { fetchArticles } from '@/services/newsApi';
import Layout from '@/components/Layout';
import PrintButton from '@/components/PrintButton';

export default async function NewsletterPage() {
    const articles = await fetchArticles(15);
    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <Layout>
            <div className="bg-[#f4f1ea] min-h-screen py-8 print:bg-white print:py-0">
                <div className="max-w-5xl mx-auto bg-white shadow-2xl p-8 md:p-12 print:shadow-none print:p-0">

                    {/* Newspaper Header */}
                    <header className="border-b-4 border-black pb-6 mb-8 text-center">
                        <div className="flex justify-between items-center border-b border-black pb-2 mb-4">
                            <span className="text-sm font-bold uppercase tracking-widest">Vol. 1, No. 1</span>
                            <span className="text-sm font-bold uppercase tracking-widest">{today}</span>
                            <span className="text-sm font-bold uppercase tracking-widest">$2.00 / Free Digital</span>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black font-serif tracking-tighter mb-2">
                            The Daily News
                        </h1>
                        <p className="text-xl font-serif italic text-gray-600">"All the News That's Fit to Click"</p>
                    </header>

                    {/* Controls (Hidden when printing) */}
                    <div className="flex justify-end mb-8 print:hidden">
                        <PrintButton />
                    </div>

                    {/* Main Headline */}
                    {articles.length > 0 && (
                        <section className="mb-12 text-center">
                            <h2 className="text-4xl md:text-6xl font-serif font-bold leading-tight mb-4 hover:underline cursor-pointer">
                                <a href={`/article/${articles[0].id}`}>{articles[0].title}</a>
                            </h2>
                            <div className="flex justify-center mb-6">
                                <div className="w-24 h-1 bg-black"></div>
                            </div>
                            <p className="text-xl md:text-2xl font-serif leading-relaxed text-gray-800 max-w-3xl mx-auto">
                                {articles[0].summary}
                            </p>
                        </section>
                    )}

                    {/* Three Column Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t-2 border-black pt-8">

                        {/* Left Column */}
                        <div className="space-y-8 border-r md:border-r-2 border-gray-200 md:pr-8">
                            <h3 className="font-sans font-bold text-sm uppercase tracking-widest border-b-2 border-black mb-4 pb-1">
                                World News
                            </h3>
                            {articles.slice(1, 4).map(article => (
                                <article key={article.id} className="mb-6">
                                    <h4 className="font-serif font-bold text-xl mb-2 leading-tight">
                                        <a href={`/article/${article.id}`} className="hover:underline">{article.title}</a>
                                    </h4>
                                    <p className="font-serif text-sm text-gray-700 leading-relaxed text-justify">
                                        {article.summary.substring(0, 150)}...
                                    </p>
                                </article>
                            ))}
                        </div>

                        {/* Middle Column */}
                        <div className="space-y-8 md:px-4">
                            <h3 className="font-sans font-bold text-sm uppercase tracking-widest border-b-2 border-black mb-4 pb-1">
                                Top Stories
                            </h3>
                            {articles.slice(4, 7).map(article => (
                                <article key={article.id} className="mb-6">
                                    {article.imageUrl && (
                                        <img src={article.imageUrl} alt={article.title} className="w-full h-32 object-cover mb-3 grayscale contrast-125" />
                                    )}
                                    <h4 className="font-serif font-bold text-lg mb-2 leading-tight">
                                        <a href={`/article/${article.id}`} className="hover:underline">{article.title}</a>
                                    </h4>
                                    <p className="font-serif text-sm text-gray-700 leading-relaxed text-justify">
                                        {article.summary.substring(0, 100)}...
                                    </p>
                                </article>
                            ))}
                        </div>

                        {/* Right Column */}
                        <div className="space-y-8 border-l md:border-l-2 border-gray-200 md:pl-8">
                            <h3 className="font-sans font-bold text-sm uppercase tracking-widest border-b-2 border-black mb-4 pb-1">
                                In Brief
                            </h3>
                            <ul className="space-y-4">
                                {articles.slice(7, 12).map(article => (
                                    <li key={article.id} className="border-b border-gray-300 pb-2">
                                        <a href={`/article/${article.id}`} className="hover:text-blue-800">
                                            <h5 className="font-serif font-bold text-md mb-1">{article.title}</h5>
                                        </a>
                                    </li>
                                ))}
                            </ul>

                            <div className="bg-gray-100 p-4 mt-8 text-center border border-gray-300">
                                <h4 className="font-sans font-bold uppercase text-xs mb-2">Subscribe Today</h4>
                                <p className="font-serif text-sm italic mb-2">Get the paper delivered to your door.</p>
                                <button className="bg-black text-white text-xs px-4 py-1 uppercase font-bold">Subscribe</button>
                            </div>
                        </div>

                    </div>

                    {/* Footer */}
                    <footer className="mt-12 pt-4 border-t-4 border-black text-center font-serif text-sm text-gray-600">
                        <p>&copy; {new Date().getFullYear()} The Daily News Portal. All rights reserved.</p>
                    </footer>

                </div>
            </div>
        </Layout>
    );
}
