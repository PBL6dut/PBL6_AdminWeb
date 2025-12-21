import { useState } from 'react';
import { Heading } from "../components/ui/Heading";
import AISearch from "../components/ai/AISearch";
import SearchHistory from "../components/ai/SearchHistory";
import BusinessInsights from "../components/ai/BusinessInsights";
import { FaSearch, FaHistory, FaChartLine } from 'react-icons/fa';

export const AIAnalysis = () => {
  const [activeTab, setActiveTab] = useState('search');

  const tabs = [
    { id: 'search', label: 'Tìm kiếm AI', icon: FaSearch, component: AISearch },
    { id: 'history', label: 'Lịch sử', icon: FaHistory, component: SearchHistory },
    { id: 'insights', label: 'Phân tích kinh doanh', icon: FaChartLine, component: BusinessInsights },
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="space-y-6">
      <Heading title="Phân tích AI" />

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow">
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <Icon className="text-lg" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[500px]">
        {ActiveComponent && <ActiveComponent />}
      </div>
    </div>
  );
};
