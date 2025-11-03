//api/scrape-details/route.ts

import { NextResponse } from 'next/server';
import * as puppeteer from 'puppeteer';
import { getRandomUserAgent, getRandomDelay, checkRobotsTxt, getProxy } from '@/lib/scraper-utils';
import { ProxyConfig } from '@/lib/proxies';

import { URL } from 'url';

// ================= FONCTIONS D'EXTRACTION ET DE DÉTECTION =================

// Fonction d'extraction avancée des emails
function extractEmailsAdvanced(html: string, visibleText: string, mainDomain: string | null = null): string[] {
  const uniqueEmails = new Set<string>();
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

  // Helper pour traiter les correspondances, gérant null/undefined
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
  processMatches(html.match(/mailto:([^"'\s<>]+)/gi)?.map(m => m.replace('mailto:', '')));

  const decodedHtml = decodeHtmlEntities(html);
  processMatches(decodedHtml.match(emailRegex));

  findObfuscatedEmails(html).forEach(email => {
    const cleanEmail = cleanEmailAddress(email, mainDomain);
    if (cleanEmail) uniqueEmails.add(cleanEmail);
  });

  return Array.from(uniqueEmails);
}

// Fonction d'extraction avancée des numéros de téléphone
function extractPhonesAdvanced(html: string, visibleText: string): string[] {
  const uniquePhones = new Set<string>();
  // Regex pour numéros de téléphone internationaux et nationaux (France, etc.)
  const phoneRegex = /(?:(?:\+|00)[1-9]\d{0,2}[-.\s]?)?(?:\(?0\d{1}\)?[-.\s]?\d{2}[-.\s]?\d{2}[-.\s]?\d{2}[-.\s]?\d{2}|\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\(?\d{2}\)?[-.\s]?\d{8,9})/g;

  const processMatches = (matches: (string | null | undefined)[] | null | undefined) => {
    (matches || []).forEach(item => {
      if (typeof item === 'string') {
        const cleanPhone = cleanPhoneNumber(item);
        if (cleanPhone) uniquePhones.add(cleanPhone);
      }
    });
  };

  processMatches(html.match(phoneRegex));
  processMatches(visibleText.match(phoneRegex));
  processMatches(html.match(/tel:([^"'\s<>]+)/gi)?.map(m => m.replace('tel:', '')));

  return Array.from(uniquePhones);
}

// Fonction pour détecter les pages de contact
function detectContactPages(html: string): number {
  let contactPageCount = 0;

  const contactLinkPatterns = [
    /href="[^"]*contact[^"]*"/gi,
    /href="[^"]*nous-contacter[^"]*"/gi,
    /href="[^"]*contactez[^"]*"/gi,
    /href="[^"]*about[^"]*"/gi,
    /href="[^"]*a-propos[^"]*"/gi
  ];

  contactLinkPatterns.forEach(pattern => {
    const matches = html.match(pattern) || [];
    contactPageCount += matches.length;
  });

  const contactForms = html.match(/<form[^>]*contact[^">]*>|<form[^>]*>[\s\S]*?contact[\s\S]*?<\/form>/gi) || [];
  contactPageCount += contactForms.length;

  const emails = extractEmailsAdvanced(html, '');
  if (emails.length > 0) {
    contactPageCount = Math.max(contactPageCount, 1);
  }

  return Math.min(contactPageCount, 5);
}

// Fonction pour détecter les réseaux sociaux
async function detectSocialNetworks(page: puppeteer.Page, html: string): Promise<{ type: string; url: string }[]> {
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

function cleanEmailAddress(email: string, mainDomain: string | null = null): string | null {
  if (!email) return null;

  let cleanEmail = email.toLowerCase().trim();
  cleanEmail = cleanEmail.replace(/[<>"']/g, '');

  const falsePositives = [
    '.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg',
    '.css', '.js', '.woff', '.ttf', '.eot', '.ico',
    'example.com', 'domain.com', 'email.com',
    'your-email@domain.com', 'email@example.com',
    'name@example.com', 'test@example.com',
    'info@', 'contact@', 'support@', 'hello@', 'admin@', // Generic prefixes
    'noreply@', 'no-reply@', 'postmaster@', 'webmaster@' // System emails
  ];

  const isFalsePositive = falsePositives.some(fp => cleanEmail.includes(fp));
  if (isFalsePositive) return null;

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(cleanEmail)) return null;

  // Filtrer par domaine si mainDomain est fourni
  // Ce filtre est appliqué pour les emails trouvés sur le site web principal
  // mais pas pour les emails trouvés sur les réseaux sociaux (voir scrapeEmailsFromSocialNetworks)
  if (mainDomain) {
    try {
      const emailDomain = cleanEmail.split('@')[1];
      const parsedMainDomain = new URL(`http://${mainDomain}`).hostname.replace(/^www\./, '');
      const parsedEmailDomain = new URL(`http://${emailDomain}`).hostname.replace(/^www\./, '');
      if (parsedEmailDomain !== parsedMainDomain) {
        console.log(`🚫 Email ${cleanEmail} filtré car le domaine (${parsedEmailDomain}) ne correspond pas au domaine principal (${parsedMainDomain}).`);
        return null;
      }
    } catch (e) {
      console.warn(`Impossible de parser le domaine pour l'email ${cleanEmail} ou le domaine principal ${mainDomain}.`);
      // En cas d'erreur de parsing, on laisse passer pour ne pas bloquer
    }
  }

  return cleanEmail;
}

function cleanPhoneNumber(phone: string): string | null {
  if (!phone) return null;
  // Supprimer tous les caractères non numériques sauf le '+' initial
  let cleanPhone = phone.replace(/[^0-9+]/g, '');

  // Si le numéro commence par '00', le remplacer par '+'
  if (cleanPhone.startsWith('00')) {
    cleanPhone = '+' + cleanPhone.substring(2);
  }

  // Filtrer les numéros trop courts ou trop longs pour être réalistes
  if (cleanPhone.length < 7 || cleanPhone.length > 15) {
    return null;
  }

  // Filtrer les faux positifs (ex: dates, codes postaux mal interprétés)
  const falsePositives = [
    /^1234567$/, // Numéro générique
    /^0000000000$/, // Zéros
    /^1111111111$/, // Un
    /^9999999999$/, // Neuf
  ];
  if (falsePositives.some(pattern => pattern.test(cleanPhone))) {
    return null;
  }

  return cleanPhone;
}

function decodeHtmlEntities(text: string): string {
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

function findObfuscatedEmails(html: string): string[] {
  const emails: string[] = [];

  const obfuscationPatterns = [
    /([a-zA-Z0-9._%+-]+)\s*\[at\]\s*([a-zA-Z0-9.-]+)\s*\[dot\]\s*([a-zA-Z]{2,})/g,
    /([a-zA-Z0-9._%+-]+)\s*\(at\)\s*([a-zA-Z0-9.-]+)\s*\(dot\)\s*([a-zA-Z]{2,})/g,
    /([a-zA-Z0-9._%+-]+)\s*@\s*\(at\)\s*([a-zA-Z0-9.-]+)\s*\.\s*\(dot\)\s*([a-zA-Z]{2,})/g,
    /([a-zA-Z0-9._%+-]+)\s*\(@\)\s*([a-zA-Z0-9.-]+)\s*\(\.\)\s*([a-zA-Z]{2,})/g,
    /([a-zA-Z0-9._%+-]+)\s*&#x40;\s*([a-zA-Z0-9.-]+)\s*&#x2E;\s*([a-zA-Z]{2,})/g
  ];

  obfuscationPatterns.forEach(pattern => {
    const matches = html.match(pattern) || [];
    matches.forEach(obfuscated => {
      const email = obfuscated
        .replace(/\s*\[at\]\s*/g, '@')
        .replace(/\s*\[dot\]\s*/g, '.')
        .replace(/\s*\(at\)\s*/g, '@')
        .replace(/\s*\(dot\)\s*/g, '.')
        .replace(/\s*\(@\)\s*/g, '@')
        .replace(/\s*\(\.\)\s*/g, '.')
        .replace(/\s*&#x40;\s*/g, '@')
        .replace(/\s*&#x2E;\s*/g, '.');
      emails.push(email);
    });
  });

  return emails;
}

// ================= FONCTION NOUVELLE : SCRAPING RÉSEAUX SOCIAUX =================

async function scrapeEmailsFromSocialNetworks(socialNetworks: { type: string; url: string }[], userAgent: string, proxyConfig: ProxyConfig | null): Promise<string[]> {
  const allEmails: string[] = [];

  console.log(`🔍 Début du scraping des réseaux sociaux pour emails...`);

  // Prioriser Facebook (le plus fiable pour les emails)
  const facebookSocial = socialNetworks.find(social => social.type === 'facebook');

  if (facebookSocial) {
    try {
      console.log(`📱 Scraping Facebook: ${facebookSocial.url}`);
      // IMPORTANT: Passer null pour mainDomain ici pour ne pas filtrer les emails par domaine sur Facebook
      const facebookEmails = await scrapeFacebookForEmails(facebookSocial.url, userAgent, proxyConfig, null);
      if (facebookEmails.length > 0) {
        console.log(`✅ Emails trouvés sur Facebook:`, facebookEmails);
        allEmails.push(...facebookEmails);
      }
    } catch (error) {
      console.log('❌ Erreur scraping Facebook:', error);
    }
  }

  // Ensuite Instagram
  const instagramSocial = socialNetworks.find(social => social.type === 'instagram');
  if (instagramSocial) {
    try {
      console.log(`📱 Scraping Instagram: ${instagramSocial.url}`);
      // IMPORTANT: Passer null pour mainDomain ici pour ne pas filtrer les emails par domaine sur Instagram
      const instagramEmails = await scrapeInstagramForEmails(instagramSocial.url, userAgent, proxyConfig, null);
      if (instagramEmails.length > 0) {
        console.log(`✅ Emails trouvés sur Instagram:`, instagramEmails);
        allEmails.push(...instagramEmails);
      }
    } catch (error) {
      console.log('❌ Erreur scraping Instagram:', error);
    }
  }

  return Array.from(new Set(allEmails));
}

// Scraper les emails depuis Facebook
async function scrapeFacebookForEmails(facebookUrl: string, userAgent: string, proxyConfig: ProxyConfig | null, mainWebsiteDomain: string | null): Promise<string[]> {
  let browser: puppeteer.Browser | undefined;

  try {
    const browserArgs = ['--no-sandbox', '--disable-setuid-sandbox']; // Arguments standard
    if (proxyConfig) {
      browserArgs.push(`--proxy-server=${proxyConfig.host}:${proxyConfig.port}`);
    }

    browser = await puppeteer.launch({
      headless: true,
      args: browserArgs,
      // Pas de executablePath pour puppeteer standard
    });

    const page = await browser.newPage();
    await page.setUserAgent(userAgent);

    if (proxyConfig && proxyConfig.username && proxyConfig.password) {
      await page.authenticate({
        username: proxyConfig.username,
        password: proxyConfig.password,
      });
    }

    console.log(`🌐 Navigation vers Facebook: ${facebookUrl}`);

    await page.goto(facebookUrl, {
      waitUntil: 'networkidle2',
      timeout: 30000 // Augmenter le timeout pour les réseaux sociaux
    });

    await new Promise(resolve => setTimeout(resolve, getRandomDelay(3000, 7000))); // Délai aléatoire

    // Essayer d'accéder à la section "À propos" où les emails sont souvent présents
    try {
      const aboutUrl = facebookUrl.replace(/\/$/, '') + '/about';
      console.log(`📄 Accès section "À propos": ${aboutUrl}`);

      await page.goto(aboutUrl, {
        waitUntil: 'networkidle2',
        timeout: 20000
      });

      await new Promise(resolve => setTimeout(resolve, getRandomDelay(2000, 5000))); // Délai aléatoire
    } catch (error) {
      console.log('❌ Impossible d\'accéder à la section "À propos"');
    }

    const html = await page.content();
    // Correction ici: passer null pour mainDomain pour ne pas filtrer les emails de Facebook
    const emails = extractEmailsAdvanced(html, '', null);

    console.log(`📧 Emails potentiels sur Facebook:`, emails);

    return emails;

  } catch (error) {
    console.log('❌ Erreur scraping Facebook:', error);
    return [];
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Scraper les emails depuis Instagram
async function scrapeInstagramForEmails(instagramUrl: string, userAgent: string, proxyConfig: ProxyConfig | null, mainWebsiteDomain: string | null): Promise<string[]> {
  let browser: puppeteer.Browser | undefined;

  try {
    const browserArgs = ['--no-sandbox', '--disable-setuid-sandbox']; // Arguments standard
    if (proxyConfig) {
      browserArgs.push(`--proxy-server=${proxyConfig.host}:${proxyConfig.port}`);
    }

    browser = await puppeteer.launch({
      headless: true,
      args: browserArgs,
      // Pas de executablePath pour puppeteer standard
    });

    const page = await browser.newPage();
    await page.setUserAgent(userAgent);

    if (proxyConfig && proxyConfig.username && proxyConfig.password) {
      await page.authenticate({
        username: proxyConfig.username,
        password: proxyConfig.password,
      });
    }

    console.log(`🌐 Navigation vers Instagram: ${instagramUrl}`);

    await page.goto(instagramUrl, {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    await new Promise(resolve => setTimeout(resolve, getRandomDelay(3000, 7000))); // Délai aléatoire

    const bioEmail = await page.evaluate(() => {
      const bioSelectors = [
        '.-vDIg span',
        'h1 + span',
        '[data-testid="user-profile-bio"]',
        'section main header section div:nth-child(2) span'
      ];

      for (const selector of bioSelectors) {
        const element = document.querySelector(selector);
        if (element && element.textContent) {
          return element.textContent;
        }
      }
      return null;
    });

    let emails: string[] = [];

    if (bioEmail) {
      console.log(`📝 Bio Instagram trouvée:`, bioEmail.substring(0, Math.min(bioEmail.length, 100)));
      // Correction ici: passer null pour mainDomain pour ne pas filtrer les emails d'Instagram
      emails = extractEmailsAdvanced(bioEmail, '', null);
    }

    if (emails.length === 0) {
      const html = await page.content();
      // Correction ici: passer null pour mainDomain pour ne pas filtrer les emails d'Instagram
      emails = extractEmailsAdvanced(html, '', null);
    }

    console.log(`📧 Emails potentiels sur Instagram:`, emails);

    return emails;

  } catch (error) {
    console.log('❌ Erreur scraping Instagram:', error);
    return [];
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// ================= ROUTE PRINCIPALE =================

export async function GET(request: Request) {
  let browser: puppeteer.Browser | undefined;
  const maxRetries = 3;
  let retryCount = 0;

  while (retryCount < maxRetries) {
    try {
      const { searchParams } = new URL(request.url);
      let websiteUrl = searchParams.get('websiteUrl');
      const enrichEmails = searchParams.get('enrichEmails') === 'true';
      const enrichPhones = searchParams.get('enrichPhones') === 'true';

      if (!websiteUrl) {
        return NextResponse.json(
          { error: 'Le paramètre "websiteUrl" est requis' },
          { status: 400 }
        );
      }

      console.log(`🔍 Début du scraping complet pour: ${websiteUrl}`);

      // Nettoyer l'URL
      websiteUrl = websiteUrl.replace('https://https://', 'https://').replace('http://http://', 'http://');
      const mainWebsiteDomain = new URL(websiteUrl).hostname.replace(/^www\./, '');
      console.log(`🌐 Domaine principal du site: ${mainWebsiteDomain}`);


      const userAgent = getRandomUserAgent();
      const proxyConfig = getProxy(); // Récupère l'objet de configuration du proxy

      // 1. Vérifier robots.txt
      const isAllowed = await checkRobotsTxt(websiteUrl, userAgent);
      if (!isAllowed) {
        console.warn(`🚫 Scraping de ${websiteUrl} non autorisé par robots.txt. Tentative de réessai.`);
        retryCount++;
        await new Promise(resolve => setTimeout(resolve, getRandomDelay(5000 * retryCount, 15000 * retryCount)));
        continue;
      }

      // Lancer Puppeteer avec ou sans proxy
      const browserArgs = ['--no-sandbox', '--disable-setuid-sandbox']; // Arguments standard
      if (proxyConfig) {
        browserArgs.push(`--proxy-server=${proxyConfig.host}:${proxyConfig.port}`);
      }

      browser = await puppeteer.launch({
        headless: true,
        args: browserArgs,
        // Pas de executablePath pour puppeteer standard
      });

      const page = await browser.newPage();
      await page.setUserAgent(userAgent); // Utiliser un User-Agent aléatoire

      // Authentifier avec le proxy si les identifiants sont fournis
      if (proxyConfig && proxyConfig.username && proxyConfig.password) {
        await page.authenticate({
          username: proxyConfig.username,
          password: proxyConfig.password,
        });
      }

      // Ajouter des en-têtes réalistes
      await page.setExtraHTTPHeaders({
        'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'Connection': 'keep-alive',
      });

      await page.goto(websiteUrl, {
        waitUntil: 'networkidle2', // Attendre que le réseau soit inactif
        timeout: 45000 // Augmenter le timeout pour plus de robustesse
      });

      await new Promise(resolve => setTimeout(resolve, getRandomDelay(5000, 10000))); // Délai aléatoire plus long après le chargement initial

      // Simuler le défilement pour charger le contenu dynamique
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight / 2);
      });
      await new Promise(resolve => setTimeout(resolve, getRandomDelay(2000, 5000)));
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });
      await new Promise(resolve => setTimeout(resolve, getRandomDelay(2000, 5000)));

      // Récupérer le HTML complet
      const html = await page.content();

      // Récupérer le texte visible
      const visibleText = await page.evaluate(() => document.body.innerText);

      let emailsFromWebsite: string[] = [];
      if (enrichEmails) {
        emailsFromWebsite = extractEmailsAdvanced(html, visibleText, mainWebsiteDomain);
        console.log(`📧 Emails trouvés sur le site web (${mainWebsiteDomain}):`, emailsFromWebsite);
      }

      let phonesFromWebsite: string[] = [];
      if (enrichPhones) {
        phonesFromWebsite = extractPhonesAdvanced(html, visibleText);
        console.log(`📞 Téléphones trouvés sur le site web:`, phonesFromWebsite);
      }

      // Détecter les pages de contact
      const contactPagesCount = detectContactPages(html);
      console.log(`📄 Pages de contact détectées: ${contactPagesCount}`);

      // Détecter les réseaux sociaux
      const socialNetworks = await detectSocialNetworks(page, html);
      console.log(`🔗 Réseaux sociaux détectés:`, socialNetworks.map(s => s.type));

      let allEmails = [...emailsFromWebsite];
      let emailsFromSocial: string[] = [];

      // SI enrichEmails est activé, SCRAPER TOUJOURS LES RÉSEAUX SOCIAUX
      if (enrichEmails && socialNetworks.length > 0) {
        console.log(`🔍 Scraping des réseaux sociaux pour emails (enrichEmails activé)...`);
        emailsFromSocial = await scrapeEmailsFromSocialNetworks(socialNetworks, userAgent, proxyConfig);
        allEmails.push(...emailsFromSocial);
        console.log(`📧 Emails trouvés sur les réseaux sociaux:`, emailsFromSocial);
      }

      // Retirer les doublons
      const uniqueEmails = Array.from(new Set(allEmails));
      const uniquePhones = Array.from(new Set(phonesFromWebsite));

      console.log(`✅ Scraping complet réussi:`, {
        emailsTotal: uniqueEmails.length,
        emailsFromWebsite: emailsFromWebsite.length,
        emailsFromSocial: emailsFromSocial.length,
        phonesTotal: uniquePhones.length,
        contactPages: contactPagesCount,
        socialNetworks: socialNetworks.length
      });

      return NextResponse.json({
        emails: uniqueEmails,
        phones: uniquePhones,
        contactPagesCount: contactPagesCount,
        socialNetworks: socialNetworks,
        debug: {
          htmlLength: html.length,
          textLength: visibleText.length,
          emailCount: uniqueEmails.length,
          socialCount: socialNetworks.length,
          emailsFromWebsite: emailsFromWebsite.length,
          emailsFromSocial: emailsFromSocial.length,
          phonesFromWebsite: uniquePhones.length
        }
      });

    } catch (error: any) {
      console.error(`💥 Erreur dans /api/scrape-details (tentative ${retryCount + 1}/${maxRetries}):`, error.message);

      // Gérer les erreurs spécifiques de blocage ou de proxy
      if (browser) {
        await browser.close(); // Fermer le navigateur avant de réessayer
        browser = undefined;
      }
      if (error.message.includes('net::ERR_TOO_MANY_REDIRECTS') || error.message.includes('403 Forbidden') || error.message.includes('429 Too Many Requests') || error.message.includes('net::ERR_NO_SUPPORTED_PROXIES') || error.message.includes('ERR_CONNECTION_CLOSED') || error.message.includes('TimeoutError')) {
        console.warn(`Possible blocage, problème de proxy ou timeout détecté. Tentative de réessai après un délai.`);
        retryCount++;
        await new Promise(resolve => setTimeout(resolve, getRandomDelay(5000 * retryCount, 15000 * retryCount))); // Délai exponentiel
        continue; // Réessayer la boucle
      }

      return NextResponse.json({
        emails: [],
        phones: [],
        contactPagesCount: 0,
        socialNetworks: [],
        error: error.message
      }, { status: 500 });

    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }

  // Si toutes les tentatives ont échoué
  return NextResponse.json({
    emails: [],
    phones: [],
    contactPagesCount: 0,
    socialNetworks: [],
    error: `Failed to scrape after ${maxRetries} retries due to persistent issues.`
  }, { status: 500 });
}