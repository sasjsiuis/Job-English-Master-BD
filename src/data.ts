/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Sentence {
  en: string;
  bn: string;
  pronunciation: string;
}

export interface Topic {
  id: string;
  title: string;
  category: string;
  icon: string;
  initialSentences: Sentence[];
}

export const TOPIC_CATEGORIES = [
  "ইন্টারভিউ প্রস্তুতি (Interview Prep)",
  "কর্মক্ষেত্র (Workplace)",
  "যোগাযোগ (Communication)",
  "নেতৃত্ব ও ব্যবস্থাপনা (Leadership)",
  "আচরণবিধি ও শিষ্টাচার (Etiquette)",
  "মৌখিক পরীক্ষা ও আইএলটিএস (Mock Exam & IELTS)"
];

export const TOPICS: Topic[] = [
  {
    id: "self-intro",
    title: "নিজের পরিচয় দেয়া (Self Introduction)",
    category: "ইন্টারভিউ প্রস্তুতি (Interview Prep)",
    icon: "User",
    initialSentences: [
      { en: "Tell me about yourself.", bn: "আপনার নিজের সম্পর্কে বলুন।", pronunciation: "টেল মি অ্যাবাউট ইয়োরসেলফ" },
      { en: "I have five years of experience in marketing.", bn: "মার্কেটিংয়ে আমার পাঁচ বছরের অভিজ্ঞতা আছে।", pronunciation: "আই হ্যাভ ফাইভ ইয়ার্স অফ এক্সপেরিয়েন্স ইন মার্কেটিং" },
      { en: "I am a quick learner and a hard worker.", bn: "আমি খুব দ্রুত শিখতে পারি এবং পরিশ্রমী।", pronunciation: "আই অ্যাম এ কুইক লার্নার অ্যান্ড এ হার্ড ওয়ার্কার" },
      { en: "I graduated from Dhaka University.", bn: "আমি ঢাকা বিশ্ববিদ্যালয় থেকে স্নাতক সম্পন্ন করেছি।", pronunciation: "আই গ্র্যাজুয়েটেড ফ্রম ঢাকা ইউনিভার্সিটি" },
      { en: "I am originally from Chittagong.", bn: "আমি মূলত চট্টগ্রামের মানুষ।", pronunciation: "আই অ্যাম অরিজিনালি ফ্রম চিটাগং" }
    ]
  },
  {
    id: "strengths",
    title: "আপনার শক্তি বা দক্ষতাসমূহ (Strengths)",
    category: "ইন্টারভিউ প্রস্তুতি (Interview Prep)",
    icon: "Cpu",
    initialSentences: [
      { en: "I am excellent at problem-solving.", bn: "আমি সমস্যা সমাধানে দক্ষ।", pronunciation: "আই অ্যাম এক্সিলেন্ট অ্যাট প্রবলেম-সলভিং" },
      { en: "My greatest strength is my attention to detail.", bn: "আমার সবচেয়ে বড় শক্তি হলো সূক্ষ্ম বিষয়ে নজর রাখা।", pronunciation: "মাই গ্রেটেস্ট স্ট্রেংথ ইজ মাই অ্যাটেনশন টু ডিটেইল" },
      { en: "I work well under pressure.", bn: "আমি চাপের মুখেও ভালো কাজ করতে পারি।", pronunciation: "আই ওয়ার্ক ওয়েল আন্ডার প্রেসার" },
      { en: "I have strong communication skills.", bn: "আমার শক্তিশালী যোগাযোগ দক্ষতা আছে।", pronunciation: "আই হ্যাভ স্ট্রং কমিউনিকেশন স্কিলস" }
    ]
  },
  {
    id: "salary",
    title: "বেতন আলোচনা (Salary Negotiation)",
    category: "ইন্টারভিউ প্রস্তুতি (Interview Prep)",
    icon: "BadgeDollarSign",
    initialSentences: [
      { en: "What are your salary expectations?", bn: "আপনার বেতনের প্রত্যাশা কত?", pronunciation: "হোয়াট আর ইয়োর স্যালারি এক্সপেক্টেশনস?" },
      { en: "I am looking for a competitive salary based on my skills.", bn: "আমি আমার দক্ষতার ভিত্তিতে একটি প্রতিযোগিতামূলক বেতন খুঁজছি।", pronunciation: "আই অ্যাম লুকিং ফর এ কম্পিটিটিভ স্যালারি বেসড অন মাই স্কিলস" },
      { en: "Is the salary negotiable?", bn: "বেতন কি আলোচনা সাপেক্ষে?", pronunciation: "ইজ দ্যা স্যালারি নেগোশিয়েবল?" },
      { en: "I am open to discussion regarding the compensation package.", bn: "আমি সুযোগ-সুবিধার বিষয়ে আলোচনার জন্য প্রস্তুত।", pronunciation: "আই অ্যাম ওপেন টু ডিসকাশন রিগার্ডিং দ্যা কম্পেনসেশন প্যাকেজ" }
    ]
  },
  {
    id: "meeting",
    title: "মিটিংয়ে কথা বলা (Meeting Communication)",
    category: "কর্মক্ষেত্র (Workplace)",
    icon: "Users",
    initialSentences: [
      { en: "Shall we get started?", bn: "আমরা কি শুরু করতে পারি?", pronunciation: "শ্যাল উই গেট স্টার্টেড?" },
      { en: "I'd like to share my thoughts on this.", bn: "আমি এই বিষয়ে আমার মতামত দিতে চাই।", pronunciation: "আইড লাইক টু শেয়ার মাই থটস অন দিস" },
      { en: "Could you please clarify that point?", bn: "আপনি কি অনুগ্রহ করে ওই বিষয়টি পরিষ্কার করবেন?", pronunciation: "কুড ইউ প্লিজ ক্ল্যারিফাই দ্যাট পয়েন্ট?" },
      { en: "I agree with your suggestion.", bn: "আমি আপনার প্রস্তাবের সাথে একমত।", pronunciation: "আই অ্যাগ্রি উইথ ইয়োর সাজেশন" }
    ]
  },
  {
    id: "email-professional",
    title: "প্রফেশনাল ইমেইল লেখা (Email Etiquette)",
    category: "যোগাযোগ (Communication)",
    icon: "Mail",
    initialSentences: [
      { en: "I hope this email finds you well.", bn: "আশা করি আপনি ভালো আছেন।", pronunciation: "আই হোপ দিস ইমেইল ফাইন্ডস ইউ ওয়েল" },
      { en: "Please find the attached document.", bn: "সংযুক্ত ডকুমেন্টটি অনুগ্রহ করে দেখুন।", pronunciation: "প্লিজ ফাইন্ড দ্যা অ্যাটাচড ডকুমেন্ট" },
      { en: "Thank you for the quick response.", bn: "দ্রুত উত্তরের জন্য আপনাকে ধন্যবাদ।", pronunciation: "থ্যাঙ্ক ইউ ফর দ্যা কুইক রেসপন্স" },
      { en: "Looking forward to hearing from you.", bn: "আপনার উত্তরের অপেক্ষায় রইলাম।", pronunciation: "লুকিং ফরওয়ার্ড টু হিয়ারিং ফ্রম ইউ" }
    ]
  },
  {
    id: "problem-solving",
    title: "সমস্যা সমাধান (Problem Solving)",
    category: "নেতৃত্ব ও ব্যবস্থাপনা (Leadership)",
    icon: "Cpu",
    initialSentences: [
      { en: "Let's brainstorm some solutions.", bn: "চলুন কিছু সমাধান নিয়ে আলোচনা করি।", pronunciation: "লেটস ব্রেইনস্টর্ম সাম সলিউশনস" },
      { en: "We need to fix this issue immediately.", bn: "আমাদের এই বিষয়টি দ্রুত সমাধান করতে হবে।", pronunciation: "উই নিড টু ফিক্স দিস ইস্যু ইমিডিয়েটলি" },
      { en: "What is the root cause of this problem?", bn: "এই সমস্যার মূল কারণ কী?", pronunciation: "হোয়াট ইজ দ্যা রুট কজ অফ দিস প্রবলেম?" }
    ]
  },
  {
    id: "presentation",
    title: "প্রেজেন্টেশন স্কিল (Presentation Skills)",
    category: "যোগাযোগ (Communication)",
    icon: "Presentation",
    initialSentences: [
      { en: "Today I will discuss our yearly goals.", bn: "আজ আমি আমাদের বার্ষিক লক্ষ্যগুলো নিয়ে আলোচনা করব।", pronunciation: "টুডে আই উইল ডিসকাস আওয়ার ইয়ারলি গোলস" },
      { en: "Please look at the screen.", bn: "অনুগ্রহ করে পর্দার দিকে তাকান।", pronunciation: "প্লিজ লুক অ্যাট দ্যা স্ক্রিন" },
      { en: "Are there any questions?", bn: "আপনাদের কি কোনো প্রশ্ন আছে?", pronunciation: "আর দেয়ার এনি কোয়েশ্চেনস?" }
    ]
  },
  {
    id: "working-hours",
    title: "ছুটি ও কর্মঘণ্টা (Leave & Office Hours)",
    category: "কর্মক্ষেত্র (Workplace)",
    icon: "Clock",
    initialSentences: [
      { en: "I need to take sick leave today.", bn: "আজ আমার অসুস্থতাজনিত ছুটি প্রয়োজন।", pronunciation: "আই নিড টু টেক সিক লিভ টুডে" },
      { en: "What are the core working hours?", bn: "অফিসের প্রধান কর্মঘণ্টাগুলো কী কী?", pronunciation: "হোয়াট আর দ্যা কোর ওয়ার্কিং আওয়ার্স?" },
      { en: "I'll be working remotely tomorrow.", bn: "আগামীকাল আমি রিমোটলি কাজ করব।", pronunciation: "আইল বি ওয়ার্কিং রিমোটলি টুমরো" }
    ]
  },
  {
    id: "networking",
    title: "নেটওয়ার্কিং এবং গ্রিটিং (Networking & Greetings)",
    category: "যোগাযোগ (Communication)",
    icon: "Users",
    initialSentences: [
      { en: "It's a pleasure to meet you.", bn: "আপনার সাথে দেখা করে ভালো লাগল।", pronunciation: "ইটস এ প্লেজার টু মিট ইউ" },
      { en: "I've heard a lot about your work.", bn: "আমি আপনার কাজ সম্পর্কে অনেক শুনেছি।", pronunciation: "আইভ হার্ড এ লট অ্যাবাউট ইয়োর ওয়ার্ক" },
      { en: "Let's keep in touch.", bn: "চলুন যোগাযোগ বজায় রাখি।", pronunciation: "লেটস কিপ ইন টাচ" }
    ]
  },
  {
    id: "feedback",
    title: "ফিডব্যাক দেয়া এবং নেয়া (Giving & Receiving Feedback)",
    category: "নেতৃত্ব ও ব্যবস্থাপনা (Leadership)",
    icon: "MessageSquare",
    initialSentences: [
      { en: "I appreciate your constructive feedback.", bn: "আমি আপনার গঠনমূলক ফিডব্যাকের প্রশংসা করি।", pronunciation: "আই অ্যাপ্রিশিয়েট ইয়োর কনস্ট্রাকটিভ ফিডব্যাক" },
      { en: "You did a great job on this project.", bn: "আপনি এই প্রজেক্টে দুর্দান্ত কাজ করেছেন।", pronunciation: "ইউ ডিড এ গ্রেট জব অন দিস প্রজেক্ট" },
      { en: "How can I improve my performance?", bn: "আমি কীভাবে আমার পারফরম্যান্স উন্নত করতে পারি?", pronunciation: "হাউ ক্যান আই ইমপ্রুভ মাই পারফরম্যান্স?" }
    ]
  },
  {
    id: "negotiation",
    title: "ব্যবসায়িক আলোচনা (Business Negotiation)",
    category: "যোগাযোগ (Communication)",
    icon: "BadgeDollarSign",
    initialSentences: [
      { en: "We are looking for a long-term partnership.", bn: "আমরা একটি দীর্ঘমেয়াদী অংশীদারিত্ব খুঁজছি।", pronunciation: "উই আর লুকিং ফর এ লং-টার্ম পার্টনারশিপ" },
      { en: "Can we find a middle ground?", bn: "আমরা কি মাঝপথে কোনো সিদ্ধান্তে আসতে পারি?", pronunciation: "ক্যান উই ফাইন্ড এ মিডল গ্রাউন্ড?" },
      { en: "What are the terms of the agreement?", bn: "চুক্তির শর্তাবলি কী কী?", pronunciation: "হোয়াট আর দ্যা টার্মস অফ দ্যা অ্যাগ্রিমেন্ট?" }
    ]
  },
  {
    id: "mock-interview-1",
    title: "মৌখিক পরীক্ষা - লেভেল ১ (Mock Interview - L1)",
    category: "মৌখিক পরীক্ষা ও আইএলটিএস (Mock Exam & IELTS)",
    icon: "PhoneCall",
    initialSentences: [
      { en: "Good morning, please have a seat.", bn: "শুভ সকাল, অনুগ্রহ করে বসুন।", pronunciation: "গুড মর্নিং, প্লিজ হ্যাভ এ সিট" },
      { en: "Can you briefly describe your background?", bn: "আপনি কি সংক্ষেপে আপনার পটভূমি বর্ণনা করতে পারেন?", pronunciation: "ক্যান ইউ ব্রিফলি ডেসক্রাইব ইয়োর ব্যাকগ্রাউন্ড?" },
      { en: "Why do you want to work for our company?", bn: "আপনি কেন আমাদের কোম্পানিতে কাজ করতে চান?", pronunciation: "হোয়াই ডু ইউ ওয়ান্ট টু ওয়ার্ক ফর আওয়ার কোম্পানি?" },
      { en: "What are your strengths and weaknesses?", bn: "আপনার সবলতা এবং দুর্বলতাগুলো কী কী?", pronunciation: "হোয়াট আর ইয়োর স্ট্রেংথস অ্যান্ড উইকনেসেস?" },
      { en: "Where do you see yourself in five years?", bn: "আগামী পাঁচ বছরে আপনি নিজেকে কোথায় দেখতে চান?", pronunciation: "হোয়ার ডু ইউ সি ইয়োরসেল্ফ ইন ফাইভ ইয়ার্স?" }
    ]
  },
  {
    id: "ielts-speaking-1",
    title: "আইএলটিএস স্পিকিং - পার্ট ১ (IELTS Speaking P1)",
    category: "মৌখিক পরীক্ষা ও আইএলটিএস (Mock Exam & IELTS)",
    icon: "Headphones",
    initialSentences: [
      { en: "Let's talk about your hometown.", bn: "চলুন আপনার শহর নিয়ে কথা বলি।", pronunciation: "লেটস টক অ্যাবাউট ইয়োর হোমটাউন" },
      { en: "What do you like most about your area?", bn: "আপনার এলাকার কোন জিনিসটি আপনি সবচেয়ে বেশি পছন্দ করেন?", pronunciation: "হোয়াট ডু ইউ লাইক মোস্ট অ্যাবাউট ইয়োর এরিয়া?" },
      { en: "Is it a good place for children to grow up?", bn: "শিশুদের বেড়ে ওঠার জন্য এটি কি ভালো জায়গা?", pronunciation: "ইজ ইট এ গুড প্লেস ফর চিলড্রেন টু গ্রো আপ?" },
      { en: "Do you prefer living in a house or an apartment?", bn: "আপনি কি বাড়িতে থাকতে পছন্দ করেন নাকি অ্যাপার্টমেন্টে?", pronunciation: "ডু ইউ প্রিফার লিভিং ইন এ হাউস অর অ্যান অ্যাপার্টমেন্ট?" },
      { en: "What kind of jobs do people in your town do?", bn: "আপনার শহরের মানুষ সাধারণত কী ধরনের কাজ করে?", pronunciation: "হোয়াট কাইন্ড অফ জবস ডু পিপল ইন ইয়োর টাউন ডু?" }
    ]
  }
];
