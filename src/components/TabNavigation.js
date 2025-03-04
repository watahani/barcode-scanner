import React from 'react';
import styled, { keyframes } from 'styled-components';

const pulse = keyframes`
  0% {
    background-color: #ff6b6b;
  }
  50% {
    background-color: #ff8787;
  }
  100% {
    background-color: #ff6b6b;
  }
`;

const TabContainer = styled.div`
  display: flex;
  margin-bottom: 20px;
  border-bottom: 1px solid #ddd;
`;

const Tab = styled.button`
  padding: 10px 20px;
  background-color: ${props => props.active ? '#4dabf7' : '#f1f3f5'};
  color: ${props => props.active ? 'white' : '#495057'};
  border: none;
  border-radius: 4px 4px 0 0;
  font-size: 16px;
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  margin-right: 5px;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${props => props.active ? '#4dabf7' : '#e9ecef'};
  }
`;

const CountBadge = styled.span`
  display: inline-block;
  background-color: ${props => props.pulsing ? 'transparent' : '#ff6b6b'};
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  text-align: center;
  line-height: 24px;
  font-size: 12px;
  margin-left: 8px;
  animation: ${props => props.pulsing ? pulse : 'none'} 1.5s infinite;
`;

const TabNavigation = ({ activeTab, setActiveTab, unscannedCount }) => {
  const isPulsing = unscannedCount <= 5 && unscannedCount > 0;
  
  return (
    <TabContainer>
      <Tab 
        active={activeTab === 'unscanned'} 
        onClick={() => setActiveTab('unscanned')}
        aria-label="Show unscanned books"
        aria-selected={activeTab === 'unscanned'}
      >
        Unscanned
        <CountBadge pulsing={isPulsing}>{unscannedCount}</CountBadge>
      </Tab>
      <Tab 
        active={activeTab === 'scanned'} 
        onClick={() => setActiveTab('scanned')}
        aria-label="Show scanned books"
        aria-selected={activeTab === 'scanned'}
      >
        Scanned
      </Tab>
    </TabContainer>
  );
};

export default TabNavigation;