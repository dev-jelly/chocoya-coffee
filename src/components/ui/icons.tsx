import {
  AlertTriangle,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Command,
  CreditCard,
  File,
  FileText,
  Github,
  HelpCircle,
  Image,
  Laptop,
  Loader2,
  LucideProps,
  Moon,
  MoreVertical,
  Pizza,
  Plus,
  Settings,
  SunMedium,
  Trash,
  Twitter,
  User,
  X,
  Coffee,
  Thermometer,
  Clock,
  Droplets,
  Scale,
  Star,
  Heart,
  Bookmark,
  Share2,
  MessageSquare,
  ThumbsUp,
} from "lucide-react";
import { Suspense } from "react";

export const Icons = {
  logo: Coffee,
  close: X,
  spinner: Loader2,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  trash: Trash,
  settings: Settings,
  user: User,
  add: Plus,
  warning: AlertTriangle,
  arrowRight: ArrowRight,
  help: HelpCircle,
  pizza: Pizza,
  sun: SunMedium,
  moon: Moon,
  laptop: Laptop,
  gitHub: Github,
  twitter: Twitter,
  check: Check,
  more: MoreVertical,
  page: File,
  media: Image,
  billing: CreditCard,
  ellipsis: MoreVertical,
  post: FileText,
  command: Command,
  coffee: Coffee,
  temperature: Thermometer,
  time: Clock,
  water: Droplets,
  weight: Scale,
  star: Star,
  heart: Heart,
  bookmark: Bookmark,
  share: Share2,
  comment: MessageSquare,
  like: ThumbsUp,
  google: ({ ...props }: LucideProps) => (
    <svg
      aria-hidden="true"
      focusable="false"
      data-prefix="fab"
      data-icon="google"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 488 512"
      {...props}
    >
      <path
        fill="currentColor"
        d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
      ></path>
    </svg>
  ),
  kakao: ({ ...props }: LucideProps) => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M12 3C6.477 3 2 6.477 2 10.8C2 13.7083 3.79167 16.2417 6.33333 17.7333L5.58333 21.1C5.54167 21.2667 5.59167 21.4417 5.71667 21.55C5.8 21.6333 5.91667 21.6667 6.03333 21.6667C6.13333 21.6667 6.23333 21.6333 6.31667 21.575L10.175 19.125C10.775 19.2083 11.3833 19.25 12 19.25C17.5229 19.25 22 15.7735 22 11.45C22 7.12649 17.5229 3.65 12 3.65V3ZM7.5 12.5C6.67157 12.5 6 11.8284 6 11C6 10.1716 6.67157 9.5 7.5 9.5C8.32843 9.5 9 10.1716 9 11C9 11.8284 8.32843 12.5 7.5 12.5ZM12 12.5C11.1716 12.5 10.5 11.8284 10.5 11C10.5 10.1716 11.1716 9.5 12 9.5C12.8284 9.5 13.5 10.1716 13.5 11C13.5 11.8284 12.8284 12.5 12 12.5ZM16.5 12.5C15.6716 12.5 15 11.8284 15 11C15 10.1716 15.6716 9.5 16.5 9.5C17.3284 9.5 18 10.1716 18 11C18 11.8284 17.3284 12.5 16.5 12.5Z"
        fill="currentColor"
      />
    </svg>
  ),
}; 