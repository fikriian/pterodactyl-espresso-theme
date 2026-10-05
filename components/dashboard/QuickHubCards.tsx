import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faComments,
    faServer,
    faCreditCard,
    faLifeRing,
    faGlobe,
    faArrowUpRightFromSquare,
} from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components/macro';

interface HubLink {
    key: string;
    title: string;
    description: string;
    icon: any;
    color: string;
    bg: string;
    border: string;
    glow: string;
    url: string;
}

const CardsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 12px;
    margin-bottom: 24px;

    @media (min-width: 768px) {
        grid-template-columns: repeat(2, 1fr);
    }

    @media (min-width: 1280px) {
        grid-template-columns: repeat(4, 1fr);
    }
`;

const Card = styled.a<{ $color: string; $bg: string; $border: string; $glow: string }>`
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
    border-radius: 12px;
    background-color: #25211e;
    border: 1px solid ${({ $border }) => $border};
    text-decoration: none;
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    position: relative;
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: ${({ $color }) => $color};
        opacity: 0;
        transition: opacity 0.2s ease;
    }

    &:hover {
        border-color: ${({ $color }) => $color}40;
        transform: translateY(-2px);
        box-shadow: 0 6px 20px ${({ $glow }) => $glow};

        &::before {
            opacity: 1;
        }

        .hub-icon {
            transform: scale(1.1);
        }

        .hub-arrow {
            opacity: 1;
            transform: translateX(0);
        }
    }
`;

const IconBox = styled.div<{ $color: string; $bg: string; $border: string }>`
    width: 36px;
    height: 36px;
    border-radius: 9px;
    background-color: ${({ $bg }) => $bg};
    border: 1px solid ${({ $border }) => $border};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${({ $color }) => $color};
    font-size: 15px;
    flex-shrink: 0;
    transition: transform 0.2s ease;
`;

const CardContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
    flex: 1;
`;

const CardTitle = styled.span`
    font-family: 'Outfit', sans-serif;
    font-size: 13.5px;
    font-weight: 700;
    color: #EBF5EE;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const CardDescription = styled.span`
    font-family: 'Outfit', sans-serif;
    font-size: 11px;
    color: #8B786D;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const ArrowIcon = styled.span`
    color: #8B786D;
    font-size: 11px;
    flex-shrink: 0;
    opacity: 0;
    transform: translateX(-4px);
    transition: all 0.2s ease;
`;

const getHubLinks = (): HubLink[] => {
    const hub = (window as any).SiteConfiguration?.hubLinks;

    const allLinks: HubLink[] = [
        {
            key: 'discord',
            title: hub?.discord?.title || 'Discord',
            description: 'Join our community',
            icon: faComments,
            color: '#5865F2',
            bg: 'rgba(88, 101, 242, 0.12)',
            border: 'rgba(88, 101, 242, 0.25)',
            glow: 'rgba(88, 101, 242, 0.15)',
            url: hub?.discord?.url || 'https://dsc.gg/bytenodes',
        },
        {
            key: 'status',
            title: hub?.status?.title || 'Status',
            description: 'Nodes uptime status',
            icon: faServer,
            color: '#22c55e',
            bg: 'rgba(34, 197, 94, 0.12)',
            border: 'rgba(34, 197, 94, 0.25)',
            glow: 'rgba(34, 197, 94, 0.15)',
            url: hub?.status?.url || 'https://status.bytenodes.id',
        },
        {
            key: 'billing',
            title: hub?.billing?.title || 'Billing',
            description: 'Manage subscriptions',
            icon: faCreditCard,
            color: '#F59E0B',
            bg: 'rgba(245, 158, 11, 0.12)',
            border: 'rgba(245, 158, 11, 0.25)',
            glow: 'rgba(245, 158, 11, 0.15)',
            url: hub?.billing?.url || 'https://billing.bytenodes.id',
        },
        {
            key: 'support',
            title: hub?.support?.title || 'Support',
            description: 'Get help from staff',
            icon: faLifeRing,
            color: '#06B6D4',
            bg: 'rgba(6, 182, 212, 0.12)',
            border: 'rgba(6, 182, 212, 0.25)',
            glow: 'rgba(6, 182, 212, 0.15)',
            url: hub?.support?.url || 'https://dsc.gg/bytenodes',
        },
        {
            key: 'custom',
            title: hub?.custom?.title || 'Website',
            description: hub?.custom?.description || 'Visit our website',
            icon: faGlobe,
            color: '#A855F7',
            bg: 'rgba(168, 85, 247, 0.12)',
            border: 'rgba(168, 85, 247, 0.25)',
            glow: 'rgba(168, 85, 247, 0.15)',
            url: hub?.custom?.url || '',
        },
    ];

    return allLinks.filter((link) => {
        const config = hub?.[link.key];
        const enabled = config ? !!config.enabled : link.key !== 'custom';
        return enabled && link.url;
    });
};

export default () => {
    const links = getHubLinks();

    if (links.length === 0) return null;

    return (
        <CardsGrid>
            {links.map((link) => (
                <Card
                    key={link.key}
                    href={link.url}
                    target={'_blank'}
                    rel={'noreferrer'}
                    $color={link.color}
                    $bg={link.bg}
                    $border={link.border}
                    $glow={link.glow}
                >
                    <IconBox
                        className={'hub-icon'}
                        $color={link.color}
                        $bg={link.bg}
                        $border={link.border}
                    >
                        <FontAwesomeIcon icon={link.icon} />
                    </IconBox>
                    <CardContent>
                        <CardTitle>{link.title}</CardTitle>
                        <CardDescription>{link.description}</CardDescription>
                    </CardContent>
                    <ArrowIcon className={'hub-arrow'}>
                        <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                    </ArrowIcon>
                </Card>
            ))}
        </CardsGrid>
    );
};