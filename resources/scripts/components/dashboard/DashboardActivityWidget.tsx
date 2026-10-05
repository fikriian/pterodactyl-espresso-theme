import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faHistory,
    faSignInAlt,
    faKey,
    faUserEdit,
    faTerminal,
    faCog,
    faCircle,
} from '@fortawesome/free-solid-svg-icons';
import styled, { keyframes } from 'styled-components/macro';
import useSWR from 'swr';
import http from '@/api/http';
import { useStoreState } from 'easy-peasy';
import { formatDistanceToNowStrict } from 'date-fns';

interface ActivityEvent {
    id: string;
    event: string;
    ip: string | null;
    description: string | null;
    timestamp: string;
}

const fadeIn = keyframes`
    from {
        opacity: 0;
        transform: translateY(6px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
`;

const WidgetCard = styled.div`
    background-color: #25211e;
    border: 1px solid rgba(191, 168, 158, 0.15);
    border-radius: 12px;
    padding: 18px;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
`;

const WidgetHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid rgba(139, 120, 109, 0.15);
`;

const HeaderLeft = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;

const HeaderIcon = styled.div`
    width: 28px;
    height: 28px;
    border-radius: 7px;
    background-color: rgba(191, 168, 158, 0.1);
    border: 1px solid rgba(191, 168, 158, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #BFA89E;
    font-size: 12px;
`;

const HeaderTitle = styled.h3`
    font-family: 'Outfit', sans-serif;
    font-size: 15px;
    font-weight: 700;
    color: #EBF5EE;
    margin: 0;
`;

const ActivityList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2px;
`;

const ActivityItem = styled.div<{ $delay: number }>`
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 8px 6px;
    border-radius: 8px;
    transition: background-color 0.15s ease;
    animation: ${fadeIn} 0.3s ease both;
    animation-delay: ${({ $delay }) => $delay * 50}ms;

    &:hover {
        background-color: rgba(191, 168, 158, 0.06);
    }
`;

const ActivityDot = styled.div<{ $color: string }>`
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: ${({ $color }) => $color};
    box-shadow: 0 0 6px ${({ $color }) => $color}80;
    flex-shrink: 0;
    margin-top: 6px;
`;

const ActivityContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
    flex: 1;
`;

const ActivityEventName = styled.span`
    font-family: 'Outfit', sans-serif;
    font-size: 12.5px;
    font-weight: 600;
    color: #EBF5EE;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const ActivityTime = styled.span`
    font-family: 'Outfit', sans-serif;
    font-size: 11px;
    color: #8B786D;
`;

const EmptyState = styled.div`
    text-align: center;
    padding: 24px 12px;
    color: #8B786D;
    font-family: 'Outfit', sans-serif;
    font-size: 13px;
`;

const LoadingWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 32px 0;
`;

const LoadingDot = styled.div<{ $delay: number }>`
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: #BFA89E;
    margin: 0 3px;
    animation: ${keyframes`
        0%, 100% { opacity: 0.3; transform: scale(0.8); }
        50% { opacity: 1; transform: scale(1); }
    `} 1.2s ease infinite;
    animation-delay: ${({ $delay }) => $delay}ms;
`;

const getEventMeta = (event: string): { label: string; color: string } => {
    if (event.includes('auth') || event.includes('login') || event.includes('sign')) {
        return { label: 'Authentication', color: '#22c55e' };
    }
    if (event.includes('api-key') || event.includes('ssh')) {
        return { label: 'Credentials', color: '#F59E0B' };
    }
    if (event.includes('update') || event.includes('email') || event.includes('password')) {
        return { label: 'Account Update', color: '#5865F2' };
    }
    if (event.includes('two_factor') || event.includes('2fa')) {
        return { label: 'Two-Factor Auth', color: '#06B6D4' };
    }
    if (event.includes('server') || event.includes('power') || event.includes('console')) {
        return { label: 'Server Action', color: '#A855F7' };
    }
    return { label: event.replace(/[:.]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()).trim(), color: '#BFA89E' };
};

const formatTime = (timestamp: string): string => {
    try {
        return formatDistanceToNowStrict(new Date(timestamp), { addSuffix: true });
    } catch {
        return '';
    }
};

export default () => {
    const { data, error } = useSWR<ActivityEvent[]>(
        '/api/client/account/activity',
        async () => {
            const { data } = await http.get('/api/client/account/activity', {
                params: { 'per_page': 8 },
            });
            return (data.data || []).map((item: any) => ({
                id: item.attributes?.id || item.id || Math.random().toString(),
                event: item.attributes?.event || '',
                ip: item.attributes?.ip || null,
                description: item.attributes?.description || null,
                timestamp: item.attributes?.timestamp || '',
            }));
        },
        { refreshInterval: 60000, revalidateOnFocus: false }
    );

    const isLoading = !data && !error;

    return (
        <WidgetCard>
            <WidgetHeader>
                <HeaderLeft>
                    <HeaderIcon>
                        <FontAwesomeIcon icon={faHistory} />
                    </HeaderIcon>
                    <HeaderTitle>Recent Activity</HeaderTitle>
                </HeaderLeft>
            </WidgetHeader>

            {isLoading ? (
                <LoadingWrapper>
                    <LoadingDot $delay={0} />
                    <LoadingDot $delay={200} />
                    <LoadingDot $delay={400} />
                </LoadingWrapper>
            ) : !data || data.length === 0 ? (
                <EmptyState>No recent activity to display.</EmptyState>
            ) : (
                <ActivityList>
                    {data.slice(0, 8).map((activity, index) => {
                        const meta = getEventMeta(activity.event);
                        return (
                            <ActivityItem key={activity.id} $delay={index}>
                                <ActivityDot $color={meta.color} />
                                <ActivityContent>
                                    <ActivityEventName>{meta.label}</ActivityEventName>
                                    <ActivityTime>{formatTime(activity.timestamp)}</ActivityTime>
                                </ActivityContent>
                            </ActivityItem>
                        );
                    })}
                </ActivityList>
            )}
        </WidgetCard>
    );
};
