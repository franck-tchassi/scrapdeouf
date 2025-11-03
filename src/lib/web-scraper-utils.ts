//lib/web-scraper-utils.ts

import { Page, Browser } from 'playwright';

// Fonction d'extraction avancée des emails
export function extractEmailsAdvanced(html: string, visibleText: string, mainDomain: string | null = null): string[] {
  const uniqueEmails = new Set<string>();
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  
  const processMatches = (matches: (string | null | undefined)[] | null | undefined) => {
    (matches || []).forEach(item => {
      if (typeof item === 'string') {
        const cleanEmail = cleanEmailAddress(item, mainDomain);
        if (cleanEmail) uniqueEmails.add(cleanEmail);
      }
    });
  };

  processMatches(html.match(emailRegex));
  processMatches(visibleText.match(emailRegex));
  processMatches(html.match(/mailto:([^"'\s<>?]+)/gi)?.map(m => m.replace(/^mailto:/i, '')));
  
  const decodedHtml = decodeHtmlEntities(html);
  processMatches(decodedHtml.match(emailRegex));

  findObfuscatedEmails(html).forEach(email => {
    const cleanEmail = cleanEmailAddress(email, mainDomain);
    if (cleanEmail) uniqueEmails.add(cleanEmail);
  });

  const attributeEmails = html.match(/data-email="([^"]+)"|data-contact="([^"]+)"|email="([^"]+)"/gi) || [];
  attributeEmails.forEach(attr => {
    const emailMatch = attr.match(/["']([^"']+@[^"']+)["']/);
    if (emailMatch) {
      const cleanEmail = cleanEmailAddress(emailMatch[1], mainDomain);
      if (cleanEmail) uniqueEmails.add(cleanEmail);
    }
  });

  return Array.from(uniqueEmails);
}

export function cleanEmailAddress(email: string, mainDomain: string | null = null): string | null {
  if (!email) return null;
  
  let cleanEmail = email.toLowerCase().trim();
  cleanEmail = cleanEmail.replace(/^["'<>\s]+|["'<>\s]+$/g, '');
  
  const falsePositives = [
    '.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg',
    '.css', '.js', '.woff', '.ttf', '.eot', '.ico',
    'example.com', 'domain.com', 'email.com',
    'your-email@domain.com', 'email@example.com',
    'name@example.com', 'test@example.com',
    'noreply', 'no-reply', 'postmaster', 'webmaster'
  ];
  
  const isFalsePositive = falsePositives.some(fp => 
    cleanEmail.includes(fp) || 
    cleanEmail.endsWith('.jpg') || 
    cleanEmail.endsWith('.png') ||
    cleanEmail.endsWith('.gif')
  );
  if (isFalsePositive) return null;
  
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(cleanEmail)) return null;

  if (mainDomain) {
    try {
      const emailDomain = cleanEmail.split('@')[1];
      const parsedMainDomain = mainDomain.replace(/^www\./, '');
      const parsedEmailDomain = emailDomain.replace(/^www\./, '');
      
      if (!parsedEmailDomain.endsWith(parsedMainDomain)) {
        console.log(`🚫 Email ${cleanEmail} filtré car le domaine (${parsedEmailDomain}) ne correspond pas au domaine principal (${parsedMainDomain}).`);
        return null;
      }
    } catch (e) {
      console.warn(`Impossible de parser le domaine pour l'email ${cleanEmail}`);
    }
  }
  
  return cleanEmail;
}

export function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&#([0-9]+);/g, (match, dec) => String.fromCharCode(dec))
    .replace(/&#x([0-9a-f]+);/gi, (match, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

export function findObfuscatedEmails(html: string): string[] {
  const emails: string[] = [];
  
  const obfuscationPatterns = [
    /([a-zA-Z0-9._%+-]+)\s*\[at\]\s*([a-zA-Z0-9.-]+)\s*\[dot\]\s*([a-zA-Z]{2,})/gi,
    /([a-zA-Z0-9._%+-]+)\s*\(at\)\s*([a-zA-Z0-9.-]+)\s*\(dot\)\s*([a-zA-Z]{2,})/gi,
    /([a-zA-Z0-9._%+-]+)\s*@\s*\(at\)\s*([a-zA-Z0-9.-]+)\s*\.\s*\(dot\)\s*([a-zA-Z]{2,})/gi,
    /([a-zA-Z0-9._%+-]+)\s*\(@\)\s*([a-zA-Z0-9.-]+)\s*\(\.\)\s*([a-zA-Z]{2,})/gi,
    /([a-zA-Z0-9._%+-]+)\s*&#x40;\s*([a-zA-Z0-9.-]+)\s*&#x2E;\s*([a-zA-Z]{2,})/gi,
    /([a-zA-Z0-9._%+-]+)\s*\[@\]\s*([a-zA-Z0-9.-]+)\s*\[\.\]\s*([a-zA-Z]{2,})/gi
  ];
  
  obfuscationPatterns.forEach(pattern => {
    const matches = html.match(pattern) || [];
    matches.forEach(obfuscated => {
      const email = obfuscated
        .replace(/\s*\[at\]\s*/gi, '@')
        .replace(/\s*\[dot\]\s*/gi, '.')
        .replace(/\s*\(at\)\s*/gi, '@')
        .replace(/\s*\(dot\)\s*/gi, '.')
        .replace(/\s*\(@\)\s*/gi, '@')
        .replace(/\s*\(\.\)\s*/gi, '.')
        .replace(/\s*&#x40;\s*/gi, '@')
        .replace(/\s*&#x2E;\s*/gi, '.')
        .replace(/\s*\[@\]\s*/gi, '@')
        .replace(/\s*\[\.\]\s*/gi, '.');
      emails.push(email);
    });
  });
  
  return emails;
}

// Fonction pour détecter les réseaux sociaux
export async function detectSocialNetworks(page: Page, html: string): Promise<{ type: string; url: string }[]> {
  const socialNetworks: { type: string; url: string }[] = [];
  
  try {
    const networksFromPage = await page.evaluate(() => {
      const networks: { type: string; url: string }[] = [];
      const socialPatterns = [
        { platform: 'facebook', patterns: ['facebook.com', 'fb.com'] },
        { platform: 'instagram', patterns: ['instagram.com'] },
        { platform: 'twitter', patterns: ['twitter.com', 'x.com'] },
        { platform: 'linkedin', patterns: ['linkedin.com'] },
        { platform: 'youtube', patterns: ['youtube.com'] },
        { platform: 'tiktok', patterns: ['tiktok.com'] },
        { platform: 'pinterest', patterns: ['pinterest.com'] }
      ];

      const links = document.querySelectorAll('a[href]');
      links.forEach(link => {
        const href = link.getAttribute('href');
        if (href) {
          for (const { platform, patterns } of socialPatterns) {
            for (const pattern of patterns) {
              if (href.includes(pattern)) {
                let cleanUrl = href;
                if (cleanUrl.startsWith('//')) {
                  cleanUrl = 'https:' + cleanUrl;
                } else if (cleanUrl.startsWith('/')) {
                  cleanUrl = window.location.origin + cleanUrl;
                } else if (!cleanUrl.startsWith('http')) {
                  cleanUrl = 'https://' + cleanUrl;
                }
                
                if (!networks.some(n => n.url === cleanUrl)) {
                  networks.push({
                    type: platform,
                    url: cleanUrl
                  });
                }
                break;
              }
            }
          }
        }
      });
      return networks;
    });

    socialNetworks.push(...networksFromPage);

    const socialPatternsRegex = {
      facebook: /https?:\/\/(www\.)?(facebook|fb)\.com\/[^"'\s>]+/gi,
      instagram: /https?:\/\/(www\.)?instagram\.com\/[^"'\s>]+/gi,
      twitter: /https?:\/\/(www\.)?(twitter|x)\.com\/[^"'\s>]+/gi,
      linkedin: /https?:\/\/(www\.)?linkedin\.com\/(company|in)\/[^"'\s>]+/gi,
      youtube: /https?:\/\/(www\.)?youtube\.com\/(channel|user)\/[^"'\s>]+/gi,
      tiktok: /https?:\/\/(www\.)?tiktok\.com\/@[^"'\s>]+/gi,
      pinterest: /https?:\/\/(www\.)?pinterest\.com\/[^"'\s>]+/gi
    };

    for (const [platform, pattern] of Object.entries(socialPatternsRegex)) {
      const matches = html.match(pattern) || [];
      matches.forEach(match => {
        if (!socialNetworks.some(social => social.url === match)) {
          socialNetworks.push({
            type: platform,
            url: match
          });
        }
      });
    }

  } catch (error) {
    console.log('❌ Erreur détection réseaux sociaux:', error);
  }

  return socialNetworks;
}

// Fonction pour scraper les emails depuis Facebook (accepte maintenant l'instance du navigateur)
export async function scrapeFacebookForEmails(browser: Browser, facebookUrl: string, pagesVisitedCounter: { count: number }): Promise<string[]> {
  let page: Page | undefined;
  try {
    page = await browser.newPage(); // Créer une nouvelle page à partir du navigateur existant
    await page.setViewportSize({ width: 1280, height: 800 });

    console.log(`🌐 Navigation vers Facebook: ${facebookUrl}`);
    
    await page.goto(facebookUrl, { 
      waitUntil: 'networkidle',
      timeout: 30000
    });
    pagesVisitedCounter.count++;

    await page.waitForTimeout(3000); // Délai réduit

    const sections = ['/about', '/about_contact', '/info'];
    let allEmails: string[] = [];

    for (const section of sections) {
      try {
        const sectionUrl = facebookUrl.replace(/\/$/, '') + section;
        console.log(`📄 Accès section: ${sectionUrl}`);
        
        await page.goto(sectionUrl, { 
          waitUntil: 'networkidle',
          timeout: 15000 
        });
        pagesVisitedCounter.count++;
        
        await page.waitForTimeout(2000); // Délai réduit

        const html = await page.content();
        const emails = extractEmailsAdvanced(html, '', null);
        
        if (emails.length > 0) {
          console.log(`📧 Emails trouvés dans ${section}:`, emails);
          allEmails.push(...emails);
        }
      } catch (error) {
        console.log(`❌ Impossible d'accéder à la section ${section}`);
      }
    }

    if (allEmails.length === 0) {
      await page.goto(facebookUrl, { 
        waitUntil: 'networkidle',
        timeout: 15000 
      });
      pagesVisitedCounter.count++;
      
      const html = await page.content();
      const emails = extractEmailsAdvanced(html, '', null);
      allEmails.push(...emails);
    }

    console.log(`📧 Total emails Facebook:`, allEmails);
    
    return Array.from(new Set(allEmails));

  } catch (error) {
    console.log('❌ Erreur scraping Facebook:', error);
    return [];
  } finally {
    if (page) await page.close(); // Fermer la page, pas le navigateur
  }
}

// Fonction pour scraper les détails d'un site web (accepte maintenant l'instance du navigateur)
export async function scrapeWebsiteDetails(browser: Browser, websiteUrl: string, enrichEmails: boolean, enrichPhones: boolean, pagesVisitedCounter: { count: number }): Promise<any> {
  let page: Page | undefined;
  try {
    page = await browser.newPage(); // Créer une nouvelle page à partir du navigateur existant
    await page.setViewportSize({ width: 1280, height: 800 });

    console.log(`🌐 Navigation vers le site web pour enrichissement: ${websiteUrl}`);
    
    await page.goto(websiteUrl, { 
      waitUntil: 'domcontentloaded',
      timeout: 30000 
    });
    pagesVisitedCounter.count++;

    await page.waitForTimeout(3000); // Délai réduit

    // Simuler le défilement
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight / 3);
    });
    await page.waitForTimeout(1000); // Délai réduit
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight / 2);
    });
    await page.waitForTimeout(1000); // Délai réduit
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await page.waitForTimeout(1000); // Délai réduit

    const html = await page.content();
    const visibleText = await page.evaluate(() => document.body.innerText);
    
    const mainDomain = new URL(websiteUrl).hostname.replace(/^www\./, '');
    
    let emailsDetected: string[] = [];
    if (enrichEmails) {
      console.log(`🔍 Extraction des emails du site web: ${websiteUrl}`);
      emailsDetected = extractEmailsAdvanced(html, visibleText, mainDomain);
      console.log(`📧 Emails trouvés sur le site web:`, emailsDetected);
    }

    let phonesDetected: string[] = [];
    if (enrichPhones) {
      console.log(`🔍 Extraction des téléphones du site web: ${websiteUrl}`);
      const phoneRegex = /(\+\d{1,3}[-.\s]?)?(\(?\d{2,4}\)?[-.\s]?){2,}\d{2,4}/g;
      const rawPhones = html.match(phoneRegex) || [];
      phonesDetected = Array.from(new Set(rawPhones.map(p => p.replace(/\s/g, '')))); // Nettoyage simple
      console.log(`📞 Téléphones trouvés sur le site web:`, phonesDetected);
    }

    const socialNetworks = await detectSocialNetworks(page, html);
    console.log(`🔗 Réseaux sociaux détectés:`, socialNetworks);

    return {
      emails: emailsDetected,
      phones: phonesDetected,
      contactPagesCount: 0, // Placeholder, à implémenter si nécessaire
      socialNetworks: socialNetworks,
    };

  } catch (error) {
    console.log('❌ Erreur lors de la visite du site web pour enrichissement:', error);
    return {
      emails: [],
      phones: [],
      contactPagesCount: 0,
      socialNetworks: [],
      error: (error as Error).message,
    };
  } finally {
    if (page) await page.close(); // Fermer la page, pas le navigateur
  }
}