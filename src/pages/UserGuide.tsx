import { useEffect, useState } from "react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";

const UserGuide = () => {
  const [content, setContent] = useState<string>('');

  useEffect(() => {
    // Load the user guide markdown content
    fetch('/HOW_TO_PAGE.md')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text();
      })
      .then(text => {
        setContent(text);
      })
      .catch(error => {
        console.error('Error loading user guide:', error);
        setContent('<p>Unable to load user guide. Please try again later.</p>');
      });
  }, []);

  // Simple markdown to HTML converter
  const convertMarkdownToHTML = (markdown: string) => {
    return markdown
      // Headers
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold mt-6 mb-3">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold mt-8 mb-4">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mt-8 mb-6">$1</h1>')
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">$1</a>')
      // Lists
      .replace(/^1\.\s+(.*$)/gm, '<div class="mb-2">1. $1</div>')
      .replace(/^2\.\s+(.*$)/gm, '<div class="mb-2">2. $1</div>')
      .replace(/^3\.\s+(.*$)/gm, '<div class="mb-2">3. $1</div>')
      .replace(/^4\.\s+(.*$)/gm, '<div class="mb-2">4. $1</div>')
      .replace(/^5\.\s+(.*$)/gm, '<div class="mb-2">5. $1</div>')
      // Line breaks
      .replace(/\n\n/g, '</p><p class="mb-4">')
      // Paragraphs
      .replace(/^(?!<[h|a|d])(.*$)/gm, '<p class="mb-4">$1</p>')
      // Clean up
      .replace(/<p><\/p>/g, '')
      .replace(/<p class="mb-4"><\/p>/g, '');
  };

  const htmlContent = content ? convertMarkdownToHTML(content) : '<p>Loading user guide...</p>';

  return (
    <main className="min-h-screen bg-background">
      <Nav />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-center mb-4">How to Use GoBuyMe</h1>
          <p className="text-lg text-center text-muted-foreground">
            Complete guide for customers, vendors, and riders
          </p>
        </div>

        <div 
          className="prose prose-lg max-w-none bg-white rounded-lg shadow-lg p-8"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Can't find what you're looking for? 
            <a href="/contact" className="text-primary hover:underline ml-1">
              Contact our support team
            </a>
          </p>
        </div>
      </div>

      <Footer />
    </main>
  );
};

export default UserGuide;