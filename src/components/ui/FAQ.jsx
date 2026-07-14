import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function FAQ({ items, defaultOpen = 0 }) {
    const [openIndex, setOpenIndex] = useState(defaultOpen);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="space-y-3">
            {items.map((item, index) => (
                <div
                    key={index}
                    className="rounded-xl border border-border bg-primary-surface overflow-hidden transition-all hover:border-accent/20"
                >
                    <button
                        onClick={() => toggleFAQ(index)}
                        className="w-full flex items-center justify-between p-5 text-left transition-colors hover:bg-primary-surface/80"
                        aria-expanded={openIndex === index}
                    >
                        <span className="text-base font-semibold text-text-primary pr-4">
                            {item.question}
                        </span>
                        <ChevronDown
                            className={`h-5 w-5 text-accent flex-shrink-0 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''
                                }`}
                        />
                    </button>
                    <div
                        className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-96' : 'max-h-0'
                            }`}
                    >
                        <div className="px-5 pb-5 text-sm text-text-secondary leading-relaxed">
                            {item.answer}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
