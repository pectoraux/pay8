import { Language } from "../LangSelector/types";
import { FooterLinkType } from "./types";
import {
  TwitterIcon,
  TelegramIcon,
  RedditIcon,
  InstagramIcon,
  GithubIcon,
  DiscordIcon,
  YoutubeIcon,
  ProposalIcon,
} from "../Svg";

export const footerLinks: FooterLinkType[] = [
  {
    label: "About",
    items: [
      {
        label: "Contact",
        href: "https://docs.pancakeswap.finance/contact-us",
      },
      {
        label: "Blog",
        href: "https://blog.pancakeswap.finance/",
      },
      // {
      //   label: "Community",
      //   href: "https://docs.pancakeswap.finance/contact-us/telegram",
      // },
      // {
      //   label: "CAKE",
      //   href: "https://docs.pancakeswap.finance/tokenomics/cake",
      // },
      // {
      //   label: "—",
      // },
      // {
      //   label: "Online Store",
      //   href: "https://pancakeswap.creator-spring.com/",
      //   isHighlighted: true,
      // },
    ],
  },
  {
    label: "Help",
    items: [
      {
        label: "Customer",
        href: "Support https://docs.pancakeswap.finance/contact-us/customer-support",
      },
      {
        label: "Troubleshooting",
        href: "https://docs.pancakeswap.finance/help/troubleshooting",
      },
      {
        label: "Guides",
        href: "https://docs.pancakeswap.finance/get-started",
      },
    ],
  },
  {
    label: "Developers",
    items: [
      {
        label: "Github",
        href: "https://github.com/pectoraux",
      },
      // {
      //   label: "Documentation",
      //   href: "",
      // },
      // {
      //   label: "Bug Bounty",
      //   href: "https://app.gitbook.com/@pancakeswap-1/s/pancakeswap/code/bug-bounty",
      // },
      // {
      //   label: "Audits",
      //   href: "https://docs.pancakeswap.finance/help/faq#is-pancakeswap-safe-has-pancakeswap-been-audited",
      // },
      // {
      //   label: "Careers",
      //   href: "https://docs.pancakeswap.finance/hiring/become-a-chef",
      // },
    ],
  },
];

export const socials = [
  {
    label: "Twitter",
    icon: TwitterIcon,
    href: "https://twitter.com/payswaporg",
  },
  {
    label: "Telegram",
    icon: TelegramIcon,
    items: [
      {
        label: "English",
        href: "https://t.me/payswaporg",
      },
      {
        label: "Bahasa Indonesia",
        href: "https://t.me/payswapIndonesia",
      },
      {
        label: "中文",
        href: "https://t.me/payswap_CN",
      },
      {
        label: "Tiếng Việt",
        href: "https://t.me/payswapVN",
      },
      {
        label: "Italiano",
        href: "https://t.me/payswap_Ita",
      },
      {
        label: "русский",
        href: "https://t.me/payswap_ru",
      },
      {
        label: "Türkiye",
        href: "https://t.me/payswapturkiye",
      },
      {
        label: "Português",
        href: "https://t.me/payswapPortuguese",
      },
      {
        label: "Español",
        href: "https://t.me/payswapES",
      },
      {
        label: "日本語",
        href: "https://t.me/payswapJP",
      },
      {
        label: "Français",
        href: "https://t.me/payswapFR",
      },
      {
        label: "Deutsch",
        href: "https://t.me/payswap_DE",
      },
      {
        label: "Filipino",
        href: "https://t.me/payswap_PH",
      },
      {
        label: "ქართული ენა",
        href: "https://t.me/payswapGeorgia",
      },
      {
        label: "हिन्दी",
        href: "https://t.me/payswap_INDIA",
      },
      {
        label: "Announcements",
        href: "https://t.me/payswapAnn",
      },
    ],
  },
  {
    label: "Reddit",
    icon: RedditIcon,
    href: "https://reddit.com/r/payswap",
  },
  {
    label: "Instagram",
    icon: InstagramIcon,
    href: "https://instagram.com/payswap_official",
  },
  {
    label: "Github",
    icon: GithubIcon,
    href: "https://github.com/payswap/",
  },
  {
    label: "Discord",
    icon: DiscordIcon,
    href: "https://discord.gg/payswap",
  },
  {
    label: "Youtube",
    icon: YoutubeIcon,
    href: "https://www.youtube.com/@payswap_official",
  },
  {
    label: "Mail",
    icon: ProposalIcon,
    href: "mailto:info@payswap.org",
  },
];

export const langs: Language[] = [...Array(20)].map((_, i) => ({
  code: `en${i}`,
  language: `English${i}`,
  locale: `Locale${i}`,
}));
