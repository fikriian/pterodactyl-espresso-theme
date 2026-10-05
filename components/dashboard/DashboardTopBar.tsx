import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faSearch,
    faBars,
    faBell,
    faExternalLinkAlt,
} from '@fortawesome/free-solid-svg-icons';
import { useStoreState } from 'easy-peasy';
import styled from 'styled-components/macro';

interface TopBarProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    onOpenMobile: () => void;
}

const Bar = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 24px;
    gap: 12px;
    background-color: #141211;
    border-bottom: 1px solid rgba(139, 120, 109, 0.12);
    flex-shrink: 0;
    position: sticky;
    top: 0;
    z-index: 30;

    @media (min-width: 1024px) {
        padding: 16px 32px;
    }
`;

const LeftGroup = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
    min-width: 0;
`;

const MobileMenuBtn = styled.button`
    background: transparent;
    border: none;
    color: #8B786D;
    font-size: 18px;
    cursor: pointer;
    padding: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    transition: all 0.15s ease;

    &:hover {
        background-color: rgba(191, 168, 158, 0.1);
        color: #EBF5EE;
    }

    @media (min-width: 1024px) {
        display: none;
    }
`;

const SearchWrapper = styled.div`
    position: relative;
    flex: 1;
    max-width: 360px;
`;

const SearchIcon = styled.span`
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #8B786D;
    font-size: 13px;
    pointer-events: none;
    transition: color 0.15s ease;
`;

const SearchInput = styled.input`
    width: 100%;
    padding: 9px 14px 9px 36px;
    border-radius: 9px;
    border: 1px solid rgba(191, 168, 158, 0.15);
    background-color: #1c1917;
    color: #EBF5EE;
    font-family: 'Outfit', sans-serif;
    font-size: 13.5px;
    font-weight: 500;
    outline: none;
    transition: all 0.2s ease;
    box-sizing: border-box;

    &::placeholder {
        color: #8B786D;
        font-weight: 400;
    }

    &:focus {
        border-color: rgba(191, 168, 158, 0.35);
        background-color: #25211e;
        box-shadow: 0 0 0 3px rgba(191, 168, 158, 0.08);
    }

    &:focus + ${SearchIcon} {
        color: #BFA89E;
    }
`;

const RightGroup = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
`;

const AdminLink = styled.a`
    display: none;
    align-items: center;
    gap: 6px;
    padding: 8px 14px;
    border-radius: 8px;
    background-color: rgba(191, 168, 158, 0.08);
    border: 1px solid rgba(191, 168, 158, 0.18);
    color: #BFA89E;
    font-family: 'Outfit', sans-serif;
    font-size: 12px;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.15s ease;
    white-space: nowrap;

    &:hover {
        background-color: rgba(191, 168, 158, 0.15);
        border-color: rgba(191, 168, 158, 0.3);
        color: #EBF5EE;
    }

    @media (min-width: 768px) {
        display: inline-flex;
    }
`;

export default ({ searchQuery, onSearchChange, onOpenMobile }: TopBarProps) => {
    const user = useStoreState((state: any) => state.user.data);

    return (
        <Bar>
            <LeftGroup>
                <MobileMenuBtn onClick={onOpenMobile} aria-label={'Open menu'}>
                    <FontAwesomeIcon icon={faBars} />
                </MobileMenuBtn>
                <SearchWrapper>
                    <SearchInput
                        type={'text'}
                        placeholder={'Search servers...'}
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                    <SearchIcon>
                        <FontAwesomeIcon icon={faSearch} />
                    </SearchIcon>
                </SearchWrapper>
            </LeftGroup>
            <RightGroup>
                {user?.rootAdmin && (
                    <AdminLink href={'/admin'}>
                        <FontAwesomeIcon icon={faExternalLinkAlt} style={{ fontSize: '10px' }} />
                        <span>Admin</span>
                    </AdminLink>
                )}
            </RightGroup>
        </Bar>
    );
};