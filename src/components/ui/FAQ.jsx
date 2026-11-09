import { useState } from 'react';
import { IconChevronDown } from '@tabler/icons-react';

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
                    className="rounded-xl border border-border bg-primary-surface overflow-hidden transition-all sm:hover:border-accent/30"
                >
                    <button
                        type="button"
                        onClick={() => toggleFAQ(index)}
                        className="w-full min-h-[48px] p-4 sm:p-5 flex items-center justify-between text-left transition-colors sm:hover:bg-primary-surface/80 active:bg-primary-surface/90 cursor-pointer select-none"
                        aria-expanded={openIndex === index}
                    >
                        <span className="text-sm sm:text-base font-semibold text-text-primary pr-4 leading-snug">
                            {item.question}
                        </span>
                        <IconChevronDown
                            stroke={1.75}
                            className={`h-5 w-5 text-accent flex-shrink-0 transition-transform duration-300 ${
                                openIndex === index ? 'rotate-180' : ''
                            }`}
                        />
                    </button>
                    <div
                        className={`overflow-hidden transition-all duration-300 ${
                            openIndex === index ? 'max-h-96' : 'max-h-0'
                        }`}
                    >
                        <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-text-secondary leading-relaxed">
                            {item.answer}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
