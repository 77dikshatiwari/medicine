import React, { useState, useEffect } from 'react';

const sectionTitles = [
  { name: 'Composition', icon: 'fa-solid fa-flask' },
  { name: 'Purpose', icon: 'fa-solid fa-bullseye' },
  { name: 'Ayurvedic Solution', icon: 'fa-solid fa-leaf' },
  { name: 'Homeopathy Solution', icon: 'fa-solid fa-droplet' },
  { name: 'Natural Ways to Heal', icon: 'fa-solid fa-seedling' },
  { name: 'Exercises', icon: 'fa-solid fa-dumbbell' },
  { name: 'Food to Take', icon: 'fa-solid fa-utensils' },
  { name: 'History', icon: 'fa-solid fa-clock-rotate-left' },
  { name: 'Mechanism', icon: 'fa-solid fa-gears' },
  { name: 'Dosage', icon: 'fa-solid fa-pills' },
  { name: 'Benefits', icon: 'fa-solid fa-heart' },
  { name: 'Side Effects', icon: 'fa-solid fa-triangle-exclamation' },
  { name: 'Other Options', icon: 'fa-solid fa-list' },
  { name: 'Estimated Price in INR', icon: 'fa-solid fa-indian-rupee-sign' }
];

const GeneratedContent = ({ generatedContent }) => {
  const [activeSection, setActiveSection] = useState(0);

  if (!generatedContent || generatedContent.length === 0) return null;

  const lastAIResponse = generatedContent.filter(msg => msg.type === 'ai').pop();

  return (
    <div className="max-w-3xl mx-auto p-5">
      {lastAIResponse && (
        <div className="bg-white bg-opacity-90 rounded-lg shadow-lg p-6 backdrop-blur-lg">
          {formatAIResponse(lastAIResponse.content, activeSection, setActiveSection)}
        </div>
      )}
    </div>
  );
}

function formatAIResponse(content, activeSection, setActiveSection) {
  const cleanedContent = content
    .replace(/##/g, '')
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/\d+\.\s*/g, '');

  const sections = {};
  sectionTitles.forEach(title => {
    const regex = new RegExp(`${title.name}:([^]*?)(?=${sectionTitles.map(st => st.name).join('|')}|$)`, 'g');
    const match = cleanedContent.match(regex);
    if (match) {
      sections[title.name] = match[0].replace(`${title.name}:`, '').trim();
    } else {
      sections[title.name] = 'Not available';
    }
  });

  const activeSectionData = sectionTitles[activeSection];
  const sectionContent = sections[activeSectionData.name];

  return (
    <>
      <div className="flex flex-wrap gap-3 mb-4">
        {sectionTitles.map((section, index) => (
          <button
            key={index}
            className={`flex items-center gap-2 px-3 py-2 border rounded-lg transition-all ${
              index === activeSection
                ? 'bg-blue-500 text-white'
                : 'bg-transparent border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white'
            }`}
            onClick={() => setActiveSection(index)}
          >
            <i className={`${section.icon}`}></i>
            {section.name}
          </button>
        ))}
      </div>
      {sectionContent && sectionContent !== 'Not available' ? (
        <AnimatedCard
          title={activeSectionData.name}
          icon={activeSectionData.icon}
          content={sectionContent}
        />
      ) : (
        <div className="text-gray-500">No content available for {activeSectionData.name}</div>
      )}
    </>
  );
}

function AnimatedCard({ title, icon, content }) {
  const [displayedContent, setDisplayedContent] = useState([]);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    setIsAnimating(true);
    setDisplayedContent([]);
    let timeoutId;
    const lines = content.split('\n').filter(line => line.trim() !== '');

    const animateLines = (lines, index) => {
      if (index < lines.length) {
        setDisplayedContent(prevLines => [...prevLines, lines[index]]);
        timeoutId = setTimeout(() => animateLines(lines, index + 1), 500);
      } else {
        setIsAnimating(false);
      }
    };

    animateLines(lines, 0);

    return () => clearTimeout(timeoutId);
  }, [content]);

  return (
    <div className={`p-6 rounded-lg shadow-lg bg-white transition-transform ${isAnimating ? 'animate-pulse' : ''}`}>
      <h3 className="flex items-center gap-2 mb-4 text-xl font-semibold text-blue-500">
        <i className={`${icon}`}></i>
        {title}
      </h3>
      <div className="space-y-2">
        {displayedContent.map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </div>
    </div>
  );
}

export default GeneratedContent;