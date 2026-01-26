import { Input } from '@/components/ui/input';
import { CardContent, CardHeader, Card, CardTitle } from '@/components/ui/card';
import { SelectItem, Select, SelectContent, SelectValue, SelectTrigger } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Target, TrendingUp, PiggyBank, ChevronRight, BarChart3, Calendar, PlusCircle, User, BookOpen, PieChart as PieChartIcon } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Line, PieChart, Tooltip, Pie, CartesianGrid, ResponsiveContainer, Cell, LineChart, XAxis, YAxis } from 'recharts';
import { Button } from '@/components/ui/button';
// Predefined categories
const categories = [
  { id: 'food', name: 'Dining', icon: '🍽️' },
  { id: 'transport', name: 'Transport', icon: '🚗' },
  { id: 'shopping', name: 'Shopping', icon: '🛍️' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎮' },
  { id: 'housing', name: 'Housing', icon: '🏠' },
  { id: 'other', name: 'Other', icon: '📦' },
];

// Financial allocation models based on economic theories
const financialModels = [
  {
    id: 'extreme-spender',
    name: 'Extreme Spender',
    description: 'Minimal savings, maximum lifestyle',
    icon: '🛍️',
    savingsRate: 0.1, // 10% savings
    allocation: {
      housing: 0.35,    // 35% of living expenses
      food: 0.25,        // 25% of living expenses  
      transport: 0.15,   // 15% of living expenses
      shopping: 0.15,    // 15% of living expenses
      entertainment: 0.10, // 10% of living expenses
      other: 0.00        // 0% of living expenses
    },
    theory: 'For those prioritizing current lifestyle over future savings. Minimal financial cushion.'
  },
  {
    id: 'conservative',
    name: 'Conservative Saver',
    description: 'High savings rate, minimal lifestyle inflation',
    icon: '🐢',
    savingsRate: 0.5, // 50% savings
    allocation: {
      housing: 0.25,    // 25% of living expenses
      food: 0.20,        // 20% of living expenses  
      transport: 0.15,   // 15% of living expenses
      shopping: 0.15,    // 15% of living expenses
      entertainment: 0.10, // 10% of living expenses
      other: 0.15        // 15% of living expenses
    },
    theory: 'Based on David Bach\'s "Pay Yourself First" principle and the 50/30/20 rule variation for aggressive savers.'
  },
  {
    id: 'balanced',
    name: 'Balanced Approach',
    description: 'Moderate savings with comfortable lifestyle',
    icon: '⚖️',
    savingsRate: 0.3, // 30% savings
    allocation: {
      housing: 0.30,    // 30% of living expenses
      food: 0.20,        // 20% of living expenses
      transport: 0.15,   // 15% of living expenses
      shopping: 0.15,    // 15% of living expenses
      entertainment: 0.10, // 10% of living expenses
      other: 0.10        // 10% of living expenses
    },
    theory: 'Based on Elizabeth Warren\'s 50/30/20 rule: 50% needs, 30% wants, 20% savings. Adjusted for more detailed category breakdown.'
  },
  {
    id: 'flexible',
    name: 'Flexible Spender',
    description: 'Lower savings rate, higher lifestyle flexibility',
    icon: '🦋',
    savingsRate: 0.2, // 20% savings
    allocation: {
      housing: 0.35,    // 35% of living expenses
      food: 0.20,        // 20% of living expenses
      transport: 0.15,   // 15% of living expenses
      shopping: 0.15,    // 15% of living expenses
      entertainment: 0.10, // 10% of living expenses
      other: 0.05        // 5% of living expenses
    },
    theory: 'Based on behavioral economics principles allowing for lifestyle enjoyment while maintaining basic savings discipline.'
  }
];

// Economic theories and references
const economicTheories = [
  {
    name: "50/30/20 Rule",
    economist: "Elizabeth Warren",
    description: "Allocate 50% of income to needs, 30% to wants, and 20% to savings and debt repayment.",
    reference: "Warren, E., & Tyagi, A. W. (2005). All Your Worth: The Ultimate Lifetime Money Plan."
  },
  {
    name: "Pay Yourself First",
    economist: "David Bach",
    description: "Before paying bills or spending on anything else, automatically save a portion of your income.",
    reference: "Bach, D. (2004). The Automatic Millionaire."
  },
  {
    name: "Engel's Law",
    economist: "Ernst Engel",
    description: "As income rises, the proportion of income spent on food decreases, even if actual expenditure on food rises.",
    reference: "Engel, E. (1857). Die Productions- und Consumtionsverhältnisse des Königreichs Sachsen."
  },
  {
    name: "Permanent Income Hypothesis",
    economist: "Milton Friedman",
    description: "People's consumption choices are based on their 'permanent income' rather than their current income.",
    reference: "Friedman, M. (1957). A Theory of the Consumption Function."
  },
  {
    name: "Life-Cycle Hypothesis",
    economist: "Franco Modigliani",
    description: "Individuals plan their consumption and savings behavior over their lifetime rather than over shorter periods.",
    reference: "Modigliani, F., & Brumberg, R. (1954). Utility Analysis and the Consumption Function."
  }
];

// Translation object for Chinese
const translations = {
  en: {
    welcome: "Welcome to LongSaver",
    setupProfile: "Let's set up your profile to get started",
    personalInfo: "Personal Information",
    tellAboutYourself: "Tell us a bit about yourself",
    name: "Your Name",
    monthlyIncome: "Monthly Income (After Tax)",
    monthlyBudget: "Monthly Budget (Living Expenses)",
    budgetDescription: "This is the amount you want to spend on living expenses this month. Savings = Income - Budget.",
    financialGoal: "Financial Goal",
    financialGoalAmount: "Financial Goal Amount",
    goalAmountDescription: "The target amount you want to save for your financial goal.",
    currency: "Currency",
    language: "Language",
    getStarted: "Get Started",
    todaysTotal: "Today's Total Spending",
    dailyYoY: "Daily YoY",
    monthlyYoY: "Monthly YoY",
    yearlyYoY: "Yearly YoY",
    noExpenses: "No expenses recorded",
    addExpense: "Add Expense",
    amount: "Amount",
    category: "Category",
    note: "Note (Optional)",
    cancel: "Cancel",
    save: "Save",
    budgetAlert: "Budget Alert",
    budgetExceeded: "Budget Exceeded",
    overBudget: "Over budget",
    financialModel: "Financial Allocation Model",
    selectApproach: "Select Your Financial Approach",
    recommendedAllocation: "Recommended Allocation",
    basedOnBudget: "Based on your monthly budget of",
    forLivingExpenses: "for living expenses",
    savings: "Savings (Income - Budget)",
    livingExpenses: "Living Expenses (Budget)",
    financialGoalProgress: "Financial Goal Progress",
    goal: "Goal",
    monthlySavings: "Monthly Savings",
    estimatedTime: "Estimated Time to Goal",
    month: "month",
    months: "months",
    sevenDayTrend: "7-Day Spending Trend",
    noDataTrend: "No data yet. Start recording to view trends",
    spendingByCategory: "Spending by Category",
    noDataCategory: "No data yet. Start recording to view categories",
    savingTips: "Saving Tips",
    financialEducation: "Financial Education",
    showTheories: "Show Economic Theories & References",
    hideTheories: "Hide Economic Theories & References",
    keyTheories: "Key Economic Theories in Personal Finance",
    howToUse: "How to Use This Information",
    useInfoDescription: "These economic theories provide the foundation for modern personal finance principles. The allocation models we've provided are practical applications of these theories, adapted for real-world use. Consider your personal circumstances, financial goals, and risk tolerance when choosing an allocation strategy.",
    profileSettings: "Profile Settings",
    currentBudget: "Current budget:",
    spentThisMonth: "Spent this month:",
    home: "Home",
    analytics: "Analytics",
    tips: "Tips",
    profile: "Profile",
    cookingAdvice: "Consider cooking at home more often to reduce dining expenses.",
    transportAdvice: "Try using public transit, carpooling, or biking to save on transport costs.",
    shoppingAdvice: "Create a shopping list and stick to it to avoid impulse purchases.",
    entertainmentAdvice: "Look for free or low-cost activities to enjoy in your free time.",
    housingAdvice: "Review your housing expenses and consider if there are areas to optimize.",
    otherAdvice: "Review this expense category to see if costs can be reduced.",
    startRecording: "Start recording expenses to receive personalized saving tips",
    noSpendingData: "No spending data available",
    highTransport: "Your transport spending is high (30%+). Consider using public transit, carpooling, or biking to save money.",
    highDining: "Your dining expenses are very high (50%+). Your Engel coefficient is elevated. Try cooking at home more often to reduce costs.",
    highShopping: "Your shopping expenses are significant (40%+). Consider creating a shopping list and sticking to it to avoid impulse purchases.",
    highEntertainment: "Your entertainment spending is notable (25%+). Look for free or low-cost activities to enjoy in your free time.",
    greatJob: "Great job managing your expenses! Your spending is well-balanced across categories.",
    daysStreak: "days streak",
    selectCategory: "Select category",
    selectCurrency: "Select currency",
    selectLanguage: "Select language",
    selectGoal: "Select your primary financial goal",
    emergencyFund: "Emergency Fund",
    buyHouse: "Buy a House",
    buyCar: "Buy a Car",
    investmentPortfolio: "Investment Portfolio",
    retirementPlanning: "Retirement Planning",
    educationFund: "Education Fund",
    travelFund: "Travel Fund",
    other: "Other",
    usd: "USD ($)",
    eur: "EUR (€)",
    cny: "CNY (¥)",
    jpy: "JPY (¥)",
    english: "English",
    chinese: "中文"
  },
  zh: {
    welcome: "欢迎使用 LongSaver",
    setupProfile: "让我们设置您的个人资料以开始使用",
    personalInfo: "个人信息",
    tellAboutYourself: "告诉我们一些关于您自己的信息",
    name: "您的姓名",
    monthlyIncome: "月收入（税后）",
    monthlyBudget: "月预算（生活开支）",
    budgetDescription: "这是您本月想要用于生活开支的金额。储蓄 = 收入 - 预算。",
    financialGoal: "财务目标",
    financialGoalAmount: "财务目标金额",
    goalAmountDescription: "您想要为财务目标储蓄的目标金额。",
    currency: "货币",
    language: "语言",
    getStarted: "开始使用",
    todaysTotal: "今日总支出",
    dailyYoY: "日同比",
    monthlyYoY: "月同比",
    yearlyYoY: "年同比",
    noExpenses: "未记录支出",
    addExpense: "添加支出",
    amount: "金额",
    category: "类别",
    note: "备注（可选）",
    cancel: "取消",
    save: "保存",
    budgetAlert: "预算警告",
    budgetExceeded: "预算已超支",
    overBudget: "超出预算",
    financialModel: "财务分配模型",
    selectApproach: "选择您的财务方法",
    recommendedAllocation: "推荐分配",
    basedOnBudget: "基于您的月预算",
    forLivingExpenses: "用于生活开支",
    savings: "储蓄（收入 - 预算）",
    livingExpenses: "生活开支（预算）",
    financialGoalProgress: "财务目标进度",
    goal: "目标",
    monthlySavings: "月储蓄",
    estimatedTime: "预计达成目标时间",
    month: "个月",
    months: "个月",
    sevenDayTrend: "7天支出趋势",
    noDataTrend: "尚无数据。开始记录以查看趋势",
    spendingByCategory: "按类别支出",
    noDataCategory: "尚无数据。开始记录以查看类别",
    savingTips: "储蓄小贴士",
    financialEducation: "金融教育",
    showTheories: "显示经济理论与参考文献",
    hideTheories: "隐藏经济理论与参考文献",
    keyTheories: "个人理财中的关键经济理论",
    howToUse: "如何使用此信息",
    useInfoDescription: "这些经济理论为现代个人理财原则提供了基础。我们提供的分配模型是这些理论的实用应用，适用于现实世界。在选择分配策略时，请考虑您的个人情况、财务目标和风险承受能力。",
    profileSettings: "个人资料设置",
    currentBudget: "当前预算：",
    spentThisMonth: "本月支出：",
    home: "首页",
    analytics: "分析",
    tips: "小贴士",
    profile: "个人资料",
    cookingAdvice: "考虑多在家做饭以减少餐饮支出。",
    transportAdvice: "尝试使用公共交通、拼车或骑自行车以节省交通费用。",
    shoppingAdvice: "制定购物清单并坚持执行，避免冲动购买。",
    entertainmentAdvice: "寻找免费或低成本的活动来享受您的空闲时间。",
    housingAdvice: "审查您的住房支出，考虑是否有优化的空间。",
    otherAdvice: "审查此支出类别，看看是否可以降低成本。",
    startRecording: "开始记录支出以获得个性化的储蓄建议",
    noSpendingData: "无支出数据可用",
    highTransport: "您的交通支出很高（30%+）。考虑使用公共交通、拼车或骑自行车以节省资金。",
    highDining: "您的餐饮支出非常高（50%+）。您的恩格尔系数偏高。尝试多在家做饭以降低成本。",
    highShopping: "您的购物支出很高（40%+）。考虑制定购物清单并坚持执行，避免冲动购买。",
    highEntertainment: "您的娱乐支出很高（25%+）。寻找免费或低成本的活动来享受您的空闲时间。",
    greatJob: "您在管理支出方面做得很好！您的支出在各个类别中分配均衡。",
    daysStreak: "天连续记录",
    selectCategory: "选择类别",
    selectCurrency: "选择货币",
    selectLanguage: "选择语言",
    selectGoal: "选择您的主要财务目标",
    emergencyFund: "应急基金",
    buyHouse: "购买房屋",
    buyCar: "购买汽车",
    investmentPortfolio: "投资组合",
    retirementPlanning: "退休规划",
    educationFund: "教育基金",
    travelFund: "旅行基金",
    other: "其他",
    usd: "美元 ($)",
    eur: "欧元 (€)",
    cny: "人民币 (¥)",
    jpy: "日元 (¥)",
    english: "英文",
    chinese: "中文"
  }
};

// Introduction slides for the app
const introSlides = [
  {
    id: 1,
    title: {
      en: "Track Your Daily Expenses",
      zh: "记录您的日常支出"
    },
    description: {
      en: "Easily log your spending by category and see where your money goes each day.",
      zh: "按类别轻松记录您的支出，了解每天的钱都花在了哪里。"
    },
    icon: "📊"
  },
  {
    id: 2,
    title: {
      en: "Set Budgets & Get Alerts",
      zh: "设置预算并获取提醒"
    },
    description: {
      en: "Create monthly budgets for different categories and receive alerts when you're close to or over your limit.",
      zh: "为不同类别创建月度预算，当您接近或超出限额时收到提醒。"
    },
    icon: "💰"
  },
  {
    id: 3,
    title: {
      en: "Choose Financial Models",
      zh: "选择财务模型"
    },
    description: {
      en: "Select from proven financial allocation models based on economic theories to guide your spending and saving habits.",
      zh: "根据经济理论选择经过验证的财务分配模型，指导您的支出和储蓄习惯。"
    },
    icon: "📈"
  },
  {
    id: 4,
    title: {
      en: "Learn & Improve",
      zh: "学习并改进"
    },
    description: {
      en: "Get personalized saving tips and learn about key economic theories that can help you make better financial decisions.",
      zh: "获得个性化的储蓄建议，了解可以帮助您做出更好财务决策的关键经济理论。"
    },
    icon: "🎓"
  }
];

const Index = () => {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [streak, setStreak] = useState(0); // Consecutive check-in days, initially 0
  const [transactions, setTransactions] = useState([]); // Store all transaction records
  const [activeTab, setActiveTab] = useState('home'); // Track active bottom nav tab
  const [profile, setProfile] = useState({
    name: '',
    monthlyBudget: 0,
    currency: 'USD',
    monthlyIncome: 0,
    financialGoal: '',
    financialGoalAmount: 0, // New field for financial goal amount
    selectedModel: 'balanced',
    language: 'en' // Add language field with default value 'en'
  });
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [showFinancialEducation, setShowFinancialEducation] = useState(false);
  const [budgetAlerts, setBudgetAlerts] = useState([]); // Store budget alerts
  const [showIntro, setShowIntro] = useState(true); // Show introduction slides
  const [currentSlide, setCurrentSlide] = useState(0); // Current slide index

  // Get translation based on current language
  const t = translations[profile.language] || translations.en;

  // Calculate today's total
  const today = new Date().toISOString().split('T')[0];
  const todayTransactions = transactions.filter(t => t.date === today);
  const todayTotal = todayTransactions.reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

  // Calculate category totals
  const categoryTotals = {};
  todayTransactions.forEach(t => {
    const category = categories.find(c => c.id === t.category)?.name || 'Other';
    categoryTotals[category] = (categoryTotals[category] || 0) + parseFloat(t.amount || 0);
  });

  // Generate trend data (last 7 days)
  const getTrendData = () => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayTransactions = transactions.filter(t => t.date === dateStr);
      const total = dayTransactions.reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
      
      data.push({
        date: date.toLocaleDateString(profile.language === 'zh' ? 'zh-CN' : 'en-US', { month: 'numeric', day: 'numeric' }),
        total: total
      });
    }
    return data;
  };

  // Generate category percentage data
  const getCategoryData = () => {
    return Object.entries(categoryTotals).map(([name, value]) => ({
      name,
      value
    }));
  };

  const handleAddTransaction = () => {
    if (!amount || !selectedCategory) return;
    
    const newTransaction = {
      id: Date.now().toString(),
      amount: parseFloat(amount),
      category: selectedCategory,
      note,
      date: today,
      datetime: new Date().toISOString()
    };
    
    setTransactions(prev => [...prev, newTransaction]);
    setAmount('');
    setNote('');
    setSelectedCategory('');
    setShowAddForm(false);
    
    // If this is the first transaction today, increase consecutive check-in days
    if (todayTransactions.length === 0) {
      setStreak(prev => prev + 1);
    }
    
    // Check if this transaction exceeds the budget for the category
    checkBudgetAlert(newTransaction);
  };

  // Check if transaction exceeds budget and generate alert
  const checkBudgetAlert = (transaction) => {
    if (!isProfileComplete) return;
    
    const model = financialModels.find(m => m.id === profile.selectedModel) || financialModels[1];
    const categoryName = categories.find(c => c.id === transaction.category)?.name || 'Other';
    const categoryBudget = profile.monthlyBudget * (model.allocation[transaction.category] || 0);
    
    // Calculate total spent in this category this month
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const categorySpent = transactions
      .filter(t => {
        const transactionDate = new Date(t.date);
        return t.category === transaction.category && 
               transactionDate.getMonth() === currentMonth && 
               transactionDate.getFullYear() === currentYear;
      })
      .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
    
    // Add the current transaction amount
    const totalAfterTransaction = categorySpent + parseFloat(transaction.amount || 0);
    
    // Check if this exceeds the budget
    if (totalAfterTransaction > categoryBudget) {
      const overspent = totalAfterTransaction - categoryBudget;
      const alert = {
        id: Date.now().toString(),
        category: categoryName,
        amount: overspent,
        budget: categoryBudget,
        spent: totalAfterTransaction,
        timestamp: new Date().toISOString()
      };
      
      setBudgetAlerts(prev => [...prev, alert]);
    }
  };

  // Generate saving advice based on spending patterns
  const getSavingAdvice = () => {
    if (transactions.length === 0) {
      return t.startRecording;
    }
    
    // Calculate category percentages
    const totalSpending = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);
    if (totalSpending === 0) return t.noSpendingData;
    
    const transportTotal = categoryTotals['Transport'] || 0;
    const foodTotal = categoryTotals['Dining'] || 0;
    const shoppingTotal = categoryTotals['Shopping'] || 0;
    const entertainmentTotal = categoryTotals['Entertainment'] || 0;
    
    const transportPercentage = (transportTotal / totalSpending) * 100;
    const foodPercentage = (foodTotal / totalSpending) * 100;
    const shoppingPercentage = (shoppingTotal / totalSpending) * 100;
    const entertainmentPercentage = (entertainmentTotal / totalSpending) * 100;
    
    // Generate advice based on spending patterns
    if (transportPercentage > 30) {
      return t.highTransport;
    }
    
    if (foodPercentage > 50) {
      return t.highDining;
    }
    
    if (shoppingPercentage > 40) {
      return t.highShopping;
    }
    
    if (entertainmentPercentage > 25) {
      return t.highEntertainment;
    }
    
    // Default positive feedback
    return t.greatJob;
  };

  // Calculate YOY metrics based on actual transaction data
  const getYOYMetrics = () => {
    // Calculate today's total
    const todayTotal = transactions
      .filter(t => t.date === new Date().toISOString().split('T')[0])
      .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
    
    // Calculate yesterday's total
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    const yesterdayTotal = transactions
      .filter(t => t.date === yesterdayStr)
      .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
    
    // Calculate last month's total (same day last month)
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const lastMonthStr = lastMonth.toISOString().split('T')[0];
    const lastMonthTotal = transactions
      .filter(t => t.date === lastMonthStr)
      .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
    
    // Calculate last year's total (same day last year)
    const lastYear = new Date();
    lastYear.setFullYear(lastYear.getFullYear() - 1);
    const lastYearStr = lastYear.toISOString().split('T')[0];
    const lastYearTotal = transactions
      .filter(t => t.date === lastYearStr)
      .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
    
    // Calculate percentage changes
    const dailyChange = yesterdayTotal === 0 ? 0 : ((todayTotal - yesterdayTotal) / yesterdayTotal) * 100;
    const monthlyChange = lastMonthTotal === 0 ? 0 : ((todayTotal - lastMonthTotal) / lastMonthTotal) * 100;
    const yearlyChange = lastYearTotal === 0 ? 0 : ((todayTotal - lastYearTotal) / lastYearTotal) * 100;
    
    return {
      daily: dailyChange,
      monthly: monthlyChange,
      yearly: yearlyChange
    };
  };

  const yoyMetrics = getYOYMetrics();

  // Scroll to section based on active tab
  const scrollToSection = (sectionId) => {
    setActiveTab(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Update profile information
  const updateProfile = (field, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Complete profile setup
  const completeProfileSetup = () => {
    if (profile.name && profile.monthlyBudget > 0) {
      setIsProfileComplete(true);
    }
  };

  // Get recommended allocation based on selected model and budget
  const getRecommendedAllocation = () => {
    const model = financialModels.find(m => m.id === profile.selectedModel) || financialModels[1]; // Default to balanced
    
    // Budget is the amount allocated for living expenses
    // Savings = Income - Budget
    const livingExpenses = profile.monthlyBudget;
    const savingsAmount = profile.monthlyIncome - profile.monthlyBudget;
    
    return {
      model,
      totalBudget: profile.monthlyBudget,
      savingsAmount,
      livingExpenses,
      categoryLimits: Object.entries(model.allocation).reduce((acc, [category, percentage]) => {
        const categoryName = categories.find(c => c.id === category)?.name || category;
        acc[categoryName] = livingExpenses * percentage;
        return acc;
      }, {})
    };
  };

  // Calculate months to reach financial goal
  const getMonthsToGoal = () => {
    if (!profile.financialGoalAmount || profile.financialGoalAmount <= 0) return null;
    
    const recommendedAllocation = getRecommendedAllocation();
    const monthlySavings = recommendedAllocation.savingsAmount;
    
    if (monthlySavings <= 0) return null;
    
    return Math.ceil(profile.financialGoalAmount / monthlySavings);
  };

  // Calculate total spent this month
  const getTotalSpentThisMonth = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return transactions
      .filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear;
      })
      .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
  };

  // Calculate remaining budget
  const getRemainingBudget = () => {
    const totalSpent = getTotalSpentThisMonth();
    return profile.monthlyBudget - totalSpent;
  };

  // Calculate remaining budget for a specific category
  const getRemainingCategoryBudget = (categoryId) => {
    const model = financialModels.find(m => m.id === profile.selectedModel) || financialModels[1];
    const categoryBudget = profile.monthlyBudget * (model.allocation[categoryId] || 0);
    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const categorySpent = transactions
      .filter(t => {
        const transactionDate = new Date(t.date);
        return t.category === categoryId && 
               transactionDate.getMonth() === currentMonth && 
               transactionDate.getFullYear() === currentYear;
      })
      .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
    
    return categoryBudget - categorySpent;
  };

  // Get saving advice for a specific category
  const getCategorySavingAdvice = (categoryName) => {
    switch(categoryName) {
      case 'Dining':
        return t.cookingAdvice;
      case 'Transport':
        return t.transportAdvice;
      case 'Shopping':
        return t.shoppingAdvice;
      case 'Entertainment':
        return t.entertainmentAdvice;
      case 'Housing':
        return t.housingAdvice;
      case 'Other':
        return t.otherAdvice;
      default:
        return '';
    }
  };

  // Handle swipe gestures for intro slides
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    const startX = touch.clientX;
    
    const handleTouchMove = (e) => {
      const touch = e.touches[0];
      const currentX = touch.clientX;
      const diff = startX - currentX;
      
      if (Math.abs(diff) > 50) { // Minimum swipe distance
        if (diff > 0 && currentSlide < introSlides.length - 1) {
          // Swipe left - next slide
          setCurrentSlide(prev => prev + 1);
        } else if (diff < 0 && currentSlide > 0) {
          // Swipe right - previous slide
          setCurrentSlide(prev => prev - 1);
        }
        
        // Remove event listeners after swipe
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      }
    };
    
    const handleTouchEnd = () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
    
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  };

  // If profile is not complete, show profile setup screen
  if (!isProfileComplete) {
    return (
      <div className="min-h-screen bg-white p-4 flex items-center justify-center">
        <div className="max-w-md w-full">
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="bg-white border-b border-gray-100 rounded-t-lg text-center">
              <CardTitle className="text-xl text-gray-900">{t.welcome}</CardTitle>
              <p className="text-sm text-gray-500 mt-1">{t.setupProfile}</p>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="text-center">
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <User className="h-8 w-8 text-gray-600" />
                  </div>
                  <h2 className="text-lg font-medium text-gray-900">{t.personalInfo}</h2>
                  <p className="text-sm text-gray-500 mt-1">{t.tellAboutYourself}</p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">{t.name}</label>
                    <Input
                      placeholder={profile.language === 'zh' ? '输入您的姓名' : 'Enter your name'}
                      value={profile.name}
                      onChange={(e) => updateProfile('name', e.target.value)}
                      className="border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">{t.monthlyIncome}</label>
                    <div className="relative">
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={profile.monthlyIncome || ''}
                        onChange={(e) => updateProfile('monthlyIncome', parseFloat(e.target.value) || 0)}
                        className="pl-8 border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                      />
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        {profile.currency === 'USD' && '$'}
                        {profile.currency === 'EUR' && '€'}
                        {profile.currency === 'CNY' && '¥'}
                        {profile.currency === 'JPY' && '¥'}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">{t.monthlyBudget}</label>
                    <div className="relative">
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={profile.monthlyBudget || ''}
                        onChange={(e) => updateProfile('monthlyBudget', parseFloat(e.target.value) || 0)}
                        className="pl-8 border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                      />
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        {profile.currency === 'USD' && '$'}
                        {profile.currency === 'EUR' && '€'}
                        {profile.currency === 'CNY' && '¥'}
                        {profile.currency === 'JPY' && '¥'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{t.budgetDescription}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">{t.financialGoal}</label>
                    <Select value={profile.financialGoal} onValueChange={(value) => updateProfile('financialGoal', value)}>
                      <SelectTrigger className="border-gray-300 focus:border-gray-500 focus:ring-gray-500">
                        <SelectValue placeholder={t.selectGoal} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="emergency">{t.emergencyFund}</SelectItem>
                        <SelectItem value="house">{t.buyHouse}</SelectItem>
                        <SelectItem value="car">{t.buyCar}</SelectItem>
                        <SelectItem value="investment">{t.investmentPortfolio}</SelectItem>
                        <SelectItem value="retirement">{t.retirementPlanning}</SelectItem>
                        <SelectItem value="education">{t.educationFund}</SelectItem>
                        <SelectItem value="travel">{t.travelFund}</SelectItem>
                        <SelectItem value="other">{t.other}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">{t.financialGoalAmount}</label>
                    <div className="relative">
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={profile.financialGoalAmount || ''}
                        onChange={(e) => updateProfile('financialGoalAmount', parseFloat(e.target.value) || 0)}
                        className="pl-8 border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                      />
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        {profile.currency === 'USD' && '$'}
                        {profile.currency === 'EUR' && '€'}
                        {profile.currency === 'CNY' && '¥'}
                        {profile.currency === 'JPY' && '¥'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{t.goalAmountDescription}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">{t.currency}</label>
                    <Select value={profile.currency} onValueChange={(value) => updateProfile('currency', value)}>
                      <SelectTrigger className="border-gray-300 focus:border-gray-500 focus:ring-gray-500">
                        <SelectValue placeholder={t.selectCurrency} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">{t.usd}</SelectItem>
                        <SelectItem value="EUR">{t.eur}</SelectItem>
                        <SelectItem value="CNY">{t.cny}</SelectItem>
                        <SelectItem value="JPY">{t.jpy}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">{t.language}</label>
                    <Select value={profile.language} onValueChange={(value) => updateProfile('language', value)}>
                      <SelectTrigger className="border-gray-300 focus:border-gray-500 focus:ring-gray-500">
                        <SelectValue placeholder={t.selectLanguage} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">{t.english}</SelectItem>
                        <SelectItem value="zh">{t.chinese}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Button 
                  className="w-full py-6 text-lg bg-orange-500 hover:bg-orange-600 text-white"
                  onClick={completeProfileSetup}
                  disabled={!profile.name || profile.monthlyBudget <= 0 || profile.monthlyIncome <= 0}
                >
                  {t.getStarted}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // If intro is not shown, show intro slides
  if (showIntro) {
    return (
      <div className="min-h-screen bg-white p-4 flex items-center justify-center">
        <div className="max-w-md w-full">
          <div 
            className="relative overflow-hidden"
            onTouchStart={handleTouchStart}
          >
            <div 
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {introSlides.map((slide) => (
                <div key={slide.id} className="w-full flex-shrink-0 px-4">
                  <Card className="border-gray-200 shadow-sm">
                    <CardHeader className="bg-white border-b border-gray-100 rounded-t-lg text-center">
                      <div className="text-6xl mb-4">{slide.icon}</div>
                      <CardTitle className="text-xl text-gray-900">
                        {slide.title[profile.language] || slide.title.en}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 text-center">
                      <p className="text-gray-600 mb-8">
                        {slide.description[profile.language] || slide.description.en}
                      </p>
                      
                      {currentSlide === introSlides.length - 1 ? (
                        <Button 
                          className="w-full py-6 text-lg bg-orange-500 hover:bg-orange-600 text-white"
                          onClick={() => setShowIntro(false)}
                        >
                          {profile.language === 'zh' ? '开始使用' : 'Get Started'}
                        </Button>
                      ) : (
                        <div className="flex justify-center space-x-2">
                          <Button 
                            variant="outline"
                            className="border-gray-300 text-gray-700 hover:bg-gray-50"
                            onClick={() => setShowIntro(false)}
                          >
                            {profile.language === 'zh' ? '跳过' : 'Skip'}
                          </Button>
                          <Button 
                            className="bg-orange-500 hover:bg-orange-600 text-white"
                            onClick={() => setCurrentSlide(prev => prev + 1)}
                          >
                            {profile.language === 'zh' ? '下一步' : 'Next'}
                            <ChevronRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
            
            {/* Slide indicators */}
            <div className="flex justify-center mt-6 space-x-2">
              {introSlides.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    index === currentSlide ? 'bg-orange-500' : 'bg-gray-300'
                  }`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Get recommended allocation
  const recommendedAllocation = getRecommendedAllocation();
  const monthsToGoal = getMonthsToGoal();
  const totalSpentThisMonth = getTotalSpentThisMonth();
  const remainingBudget = getRemainingBudget();

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-20">
      <div className="max-w-md mx-auto">
        {/* Top date and check-in */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-orange-500" />
            <span className="font-medium text-gray-900">{new Date().toLocaleDateString(profile.language === 'zh' ? 'zh-CN' : 'en-US')}</span>
          </div>
          <div className="flex items-center bg-orange-100 px-3 py-1 rounded-full">
            <Target className="h-4 w-4 mr-1 text-orange-600" />
            <span className="text-sm font-medium text-orange-800">{streak} {t.daysStreak}</span>
          </div>
        </div>

        {/* Today's overview card */}
        <Card className="mb-6 border-gray-200 shadow-sm" id="home">
          <CardHeader className="pb-2 bg-white border-b border-gray-100 rounded-t-lg">
            <CardTitle className="text-lg text-gray-900">{t.todaysTotal}</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-3xl font-bold mb-4 text-gray-900">
              {profile.currency === 'USD' && '$'}
              {profile.currency === 'EUR' && '€'}
              {profile.currency === 'CNY' && '¥'}
              {profile.currency === 'JPY' && '¥'}
              {todayTotal.toFixed(2)}
            </div>
            
            {/* YOY Metrics */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="bg-gray-50 p-2 rounded-lg">
                <div className="text-xs text-gray-500">{t.dailyYoY}</div>
                <div className={`text-sm font-bold ${yoyMetrics.daily >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {yoyMetrics.daily >= 0 ? '+' : ''}{yoyMetrics.daily.toFixed(1)}%
                </div>
              </div>
              <div className="bg-gray-50 p-2 rounded-lg">
                <div className="text-xs text-gray-500">{t.monthlyYoY}</div>
                <div className={`text-sm font-bold ${yoyMetrics.monthly >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {yoyMetrics.monthly >= 0 ? '+' : ''}{yoyMetrics.monthly.toFixed(1)}%
                </div>
              </div>
              <div className="bg-gray-50 p-2 rounded-lg">
                <div className="text-xs text-gray-500">{t.yearlyYoY}</div>
                <div className={`text-sm font-bold ${yoyMetrics.yearly >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {yoyMetrics.yearly >= 0 ? '+' : ''}{yoyMetrics.yearly.toFixed(1)}%
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              {Object.keys(categoryTotals).length > 0 ? (
                Object.entries(categoryTotals).slice(0, 3).map(([category, total]) => (
                  <div key={category} className="flex justify-between text-sm">
                    <span className="text-gray-600">{category}</span>
                    <span className="font-medium text-gray-900">
                      {profile.currency === 'USD' && '$'}
                      {profile.currency === 'EUR' && '€'}
                      {profile.currency === 'CNY' && '¥'}
                      {profile.currency === 'JPY' && '¥'}
                      {total.toFixed(2)}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">{t.noExpenses}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick expense button */}
        {!showAddForm && (
          <Button 
            className="w-full mb-6 py-6 text-lg bg-orange-500 hover:bg-orange-600 text-white"
            onClick={() => setShowAddForm(true)}
          >
            <PlusCircle className="mr-2 h-5 w-5" />
            {t.addExpense}
          </Button>
        )}

        {/* Expense form */}
        {showAddForm && (
          <Card className="mb-6 border-gray-200 shadow-sm">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">{t.amount}</label>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="pl-8 text-2xl h-12 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                    />
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      {profile.currency === 'USD' && '$'}
                      {profile.currency === 'EUR' && '€'}
                      {profile.currency === 'CNY' && '¥'}
                      {profile.currency === 'JPY' && '¥'}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">{t.category}</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="border-gray-300 focus:border-orange-500 focus:ring-orange-500">
                      <SelectValue placeholder={t.selectCategory} />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          <span className="flex items-center">
                            <span className="mr-2">{category.icon}</span>
                            {category.name}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">{t.note}</label>
                  <Input
                    placeholder={profile.language === 'zh' ? '例如：地铁、午餐、出租车' : 'e.g., subway, lunch, taxi'}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                  />
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                    onClick={() => setShowAddForm(false)}
                  >
                    {t.cancel}
                  </Button>
                  <Button 
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                    onClick={handleAddTransaction}
                    disabled={!amount || !selectedCategory}
                  >
                    {t.save}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Budget Alerts */}
        {budgetAlerts.length > 0 && (
          <Card className="mb-6 border-red-200 shadow-sm">
            <CardHeader className="bg-white border-b border-red-100 rounded-t-lg">
              <CardTitle className="text-lg flex items-center text-red-700">
                <Target className="h-5 w-5 mr-2" />
                {t.budgetAlert}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                {budgetAlerts.map((alert) => (
                  <div key={alert.id} className="p-3 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-red-700">{alert.category} {t.budgetExceeded}</div>
                        <div className="text-sm text-gray-600 mt-1">
                          {t.budget}: {profile.currency} {alert.budget.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-600">
                          {t.spent}: {profile.currency} {alert.spent.toFixed(2)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-red-600">
                          +{profile.currency} {alert.amount.toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-500">{t.overBudget}</div>
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-700">
                      {alert.category === 'Dining' && t.cookingAdvice}
                      {alert.category === 'Transport' && t.transportAdvice}
                      {alert.category === 'Shopping' && t.shoppingAdvice}
                      {alert.category === 'Entertainment' && t.entertainmentAdvice}
                      {alert.category === 'Housing' && t.housingAdvice}
                      {alert.category === 'Other' && t.otherAdvice}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Financial Model Selection */}
        <Card className="mb-6 border-gray-200 shadow-sm">
          <CardHeader className="bg-white border-b border-gray-100 rounded-t-lg">
            <CardTitle className="text-lg flex items-center text-gray-900">
              <PieChartIcon className="h-5 w-5 mr-2" />
              {t.financialModel}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">{t.selectApproach}</label>
                <Select value={profile.selectedModel} onValueChange={(value) => updateProfile('selectedModel', value)}>
                  <SelectTrigger className="border-gray-300 focus:border-orange-500 focus:ring-orange-500">
                    <SelectValue placeholder={profile.language === 'zh' ? '选择财务模型' : 'Choose a financial model'} />
                  </SelectTrigger>
                  <SelectContent>
                    {financialModels.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        <div className="flex items-center">
                          <span className="text-xl mr-2">{model.icon}</span>
                          <div>
                            <div className="font-medium">{model.name}</div>
                            <div className="text-xs text-gray-500">{model.description}</div>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <h3 className="font-medium mb-2 text-gray-900">{t.recommendedAllocation}</h3>
                <div className="text-sm text-gray-600 mb-3">
                  {t.basedOnBudget} {profile.currency} {profile.monthlyBudget.toFixed(2)} {t.forLivingExpenses}
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                    <span className="font-medium text-gray-900">{t.savings}</span>
                    <span className="font-bold text-green-600">
                      {profile.currency} {recommendedAllocation.savingsAmount.toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                    <span className="font-medium text-gray-900">{t.livingExpenses}</span>
                    <span className="font-bold text-blue-600">
                      {profile.currency} {recommendedAllocation.livingExpenses.toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="pl-4 space-y-1 mt-2">
                    {Object.entries(recommendedAllocation.categoryLimits).map(([category, amount]) => {
                      // Calculate remaining budget for this category
                      const categoryId = categories.find(c => c.name === category)?.id;
                      const remaining = categoryId ? getRemainingCategoryBudget(categoryId) : 0;
                      const isOverBudget = remaining < 0;
                      
                      return (
                        <div key={category} className="flex justify-between text-sm">
                          <span className="text-gray-600">{category}</span>
                          <div className="text-right">
                            <div className="font-medium text-gray-900">
                              {profile.currency} {amount.toFixed(2)}
                            </div>
                            <div className={`text-xs ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>
                              Remaining: {profile.currency} {remaining.toFixed(2)}
                            </div>
                            {isOverBudget && (
                              <div className="text-xs text-red-600 mt-1">
                                {getCategorySavingAdvice(category)}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              
              {/* Financial Goal Progress */}
              {profile.financialGoal && profile.financialGoalAmount > 0 && (
                <div className="pt-4 border-t border-gray-200">
                  <h3 className="font-medium mb-2 text-gray-900">{t.financialGoalProgress}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{t.goal}</span>
                      <span className="font-medium text-gray-900">
                        {profile.currency} {profile.financialGoalAmount.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{t.monthlySavings}</span>
                      <span className="font-medium text-gray-900">
                        {profile.currency} {recommendedAllocation.savingsAmount.toFixed(2)}
                      </span>
                    </div>
                    {monthsToGoal && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">{t.estimatedTime}</span>
                        <span className="font-medium text-gray-900">
                          {monthsToGoal} {monthsToGoal !== 1 ? t.months : t.month}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <div className="pt-2 border-t border-gray-200">
                <div className="text-xs text-gray-500 italic">
                  {recommendedAllocation.model.theory}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Analysis tabs */}
        <Tabs defaultValue="trend" className="mb-6" id="analytics">
          <TabsList className="grid grid-cols-2 mb-4 bg-gray-100 p-1 rounded-lg">
            <TabsTrigger 
              value="trend" 
              className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              {t.analytics}
            </TabsTrigger>
            <TabsTrigger 
              value="category" 
              className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              {t.category}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="trend">
            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="bg-white border-b border-gray-100 rounded-t-lg">
                <CardTitle className="text-lg text-gray-900">{t.sevenDayTrend}</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                {transactions.length > 0 ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={getTrendData()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="date" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip 
                        formatter={(value) => [
                          `${profile.currency === 'USD' && '$'}${profile.currency === 'EUR' && '€'}${profile.currency === 'CNY' && '¥'}${profile.currency === 'JPY' && '¥'}${value.toFixed(2)}`, 
                          profile.language === 'zh' ? '支出' : 'Spending'
                        ]} 
                        contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="total" 
                        stroke="#f97316" 
                        strokeWidth={2} 
                        dot={{ fill: '#f97316', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: '#f97316', strokeWidth: 2, fill: '#ffffff' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[200px] text-gray-500">
                    <p>{t.noDataTrend}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="category">
            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="bg-white border-b border-gray-100 rounded-t-lg">
                <CardTitle className="text-lg text-gray-900">{t.spendingByCategory}</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                {Object.keys(categoryTotals).length > 0 ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={getCategoryData()}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#f97316"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {getCategoryData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={`hsl(${index * 45 + 220}, 70%, 50%)`} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [
                          `${profile.currency === 'USD' && '$'}${profile.currency === 'EUR' && '€'}${profile.currency === 'CNY' && '¥'}${profile.currency === 'JPY' && '¥'}${value.toFixed(2)}`, 
                          profile.language === 'zh' ? '支出' : 'Spending'
                        ]} 
                        contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[200px] text-gray-500">
                    <p>{t.noDataCategory}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Saving advice card */}
        <Card className="mb-6 border-gray-200 shadow-sm" id="tips">
          <CardHeader className="bg-white border-b border-gray-100 rounded-t-lg">
            <CardTitle className="text-lg flex items-center text-gray-900">
              <PiggyBank className="h-5 w-5 mr-2" />
              {t.savingTips}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-gray-700">{getSavingAdvice()}</p>
          </CardContent>
        </Card>

        {/* Financial Education Card */}
        <Card className="mb-6 border-gray-200 shadow-sm">
          <CardHeader className="bg-white border-b border-gray-100 rounded-t-lg">
            <CardTitle className="text-lg flex items-center text-gray-900">
              <BookOpen className="h-5 w-5 mr-2" />
              {t.financialEducation}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              <Button 
                variant="outline" 
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                onClick={() => setShowFinancialEducation(!showFinancialEducation)}
              >
                {showFinancialEducation ? t.hideTheories : t.showTheories}
              </Button>
              
              {showFinancialEducation && (
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">{t.keyTheories}</h3>
                  
                  <div className="space-y-3">
                    {economicTheories.map((theory, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <div className="font-medium text-gray-900">{theory.name}</div>
                        <div className="text-sm text-gray-600 mb-1">by {theory.economist}</div>
                        <div className="text-sm text-gray-700 mb-2">{theory.description}</div>
                        <div className="text-xs text-gray-500 italic">{theory.reference}</div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-1">{t.howToUse}</h4>
                    <p className="text-sm text-gray-700">
                      {t.useInfoDescription}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Profile section */}
        <Card className="mb-6 border-gray-200 shadow-sm" id="profile">
          <CardHeader className="bg-white border-b border-gray-100 rounded-t-lg">
            <CardTitle className="text-lg flex items-center text-gray-900">
              <User className="h-5 w-5 mr-2" />
              {t.profileSettings}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">{t.name}</label>
                <Input
                  value={profile.name}
                  onChange={(e) => updateProfile('name', e.target.value)}
                  className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">{t.monthlyIncome}</label>
                <div className="relative">
                  <Input
                    type="number"
                    value={profile.monthlyIncome}
                    onChange={(e) => updateProfile('monthlyIncome', parseFloat(e.target.value) || 0)}
                    className="pl-8 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                  />
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    {profile.currency === 'USD' && '$'}
                    {profile.currency === 'EUR' && '€'}
                    {profile.currency === 'CNY' && '¥'}
                    {profile.currency === 'JPY' && '¥'}
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">{t.monthlyBudget}</label>
                <div className="relative">
                  <Input
                    type="number"
                    value={profile.monthlyBudget}
                    onChange={(e) => updateProfile('monthlyBudget', parseFloat(e.target.value) || 0)}
                    className="pl-8 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                  />
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    {profile.currency === 'USD' && '$'}
                    {profile.currency === 'EUR' && '€'}
                    {profile.currency === 'CNY' && '¥'}
                    {profile.currency === 'JPY' && '¥'}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{t.budgetDescription}</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">{t.financialGoal}</label>
                <Select value={profile.financialGoal} onValueChange={(value) => updateProfile('financialGoal', value)}>
                  <SelectTrigger className="border-gray-300 focus:border-orange-500 focus:ring-orange-500">
                    <SelectValue placeholder={t.selectGoal} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="emergency">{t.emergencyFund}</SelectItem>
                    <SelectItem value="house">{t.buyHouse}</SelectItem>
                    <SelectItem value="car">{t.buyCar}</SelectItem>
                    <SelectItem value="investment">{t.investmentPortfolio}</SelectItem>
                    <SelectItem value="retirement">{t.retirementPlanning}</SelectItem>
                    <SelectItem value="education">{t.educationFund}</SelectItem>
                    <SelectItem value="travel">{t.travelFund}</SelectItem>
                    <SelectItem value="other">{t.other}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">{t.financialGoalAmount}</label>
                <div className="relative">
                  <Input
                    type="number"
                    value={profile.financialGoalAmount}
                    onChange={(e) => updateProfile('financialGoalAmount', parseFloat(e.target.value) || 0)}
                    className="pl-8 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                  />
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    {profile.currency === 'USD' && '$'}
                    {profile.currency === 'EUR' && '€'}
                    {profile.currency === 'CNY' && '¥'}
                    {profile.currency === 'JPY' && '¥'}
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">{t.currency}</label>
                <Select value={profile.currency} onValueChange={(value) => updateProfile('currency', value)}>
                  <SelectTrigger className="border-gray-300 focus:border-orange-500 focus:ring-orange-500">
                    <SelectValue placeholder={t.selectCurrency} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">{t.usd}</SelectItem>
                    <SelectItem value="EUR">{t.eur}</SelectItem>
                    <SelectItem value="CNY">{t.cny}</SelectItem>
                    <SelectItem value="JPY">{t.jpy}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">{t.language}</label>
                <Select value={profile.language} onValueChange={(value) => updateProfile('language', value)}>
                  <SelectTrigger className="border-gray-300 focus:border-orange-500 focus:ring-orange-500">
                    <SelectValue placeholder={t.selectLanguage} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">{t.english}</SelectItem>
                    <SelectItem value="zh">{t.chinese}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="pt-2">
                <div className="text-sm text-gray-600">
                  <p>{t.currentBudget} <span className="font-medium text-gray-900">{profile.currency} {profile.monthlyBudget}</span></p>
                  <p>{t.spentThisMonth} <span className="font-medium text-gray-900">{profile.currency} {totalSpentThisMonth.toFixed(2)}</span></p>
                  <p>Remaining: <span className={`font-medium ${remainingBudget < 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {profile.currency} {remainingBudget.toFixed(2)}
                  </span></p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bottom navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-sm">
          <div className="max-w-md mx-auto flex justify-around py-2">
            <Button 
              variant="ghost" 
              className={`flex flex-col items-center ${activeTab === 'home' ? 'text-orange-500' : 'text-gray-500'}`}
              onClick={() => scrollToSection('home')}
            >
              <BarChart3 className="h-5 w-5" />
              <span className="text-xs mt-1">{t.home}</span>
            </Button>
            <Button 
              variant="ghost" 
              className={`flex flex-col items-center ${activeTab === 'analytics' ? 'text-orange-500' : 'text-gray-500'}`}
              onClick={() => scrollToSection('analytics')}
            >
              <TrendingUp className="h-5 w-5" />
              <span className="text-xs mt-1">{t.analytics}</span>
            </Button>
            <Button 
              variant="ghost" 
              className={`flex flex-col items-center ${activeTab === 'tips' ? 'text-orange-500' : 'text-gray-500'}`}
              onClick={() => scrollToSection('tips')}
            >
              <PiggyBank className="h-5 w-5" />
              <span className="text-xs mt-1">{t.tips}</span>
            </Button>
            <Button 
              variant="ghost" 
              className={`flex flex-col items-center ${activeTab === 'profile' ? 'text-orange-500' : 'text-gray-500'}`}
              onClick={() => scrollToSection('profile')}
            >
              <User className="h-5 w-5" />
              <span className="text-xs mt-1">{t.profile}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
