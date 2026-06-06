import React from 'react';
import { Popover } from 'antd';
import type { GuestSelection } from '../../../types/search';
import { useLanguage } from '../../../context';
import styles from './GuestSelector.module.css';

interface GuestSelectorProps {
    value: GuestSelection;
    onChange: (value: GuestSelection) => void;
    /** Show only adults (for flights/experiences) */
    simpleMode?: boolean;
}

const GuestSelector: React.FC<GuestSelectorProps> = ({ value, onChange, simpleMode = false }) => {
    const { t } = useLanguage();

    const update = (field: keyof GuestSelection, delta: number) => {
        const next = { ...value, [field]: value[field] + delta };

        // Constraints
        if (next.adults < 1 || next.adults > 10) return;
        if (next.children < 0 || next.children > 6) return;
        if (next.rooms < 1 || next.rooms > 5) return;
        // rooms cannot exceed adults
        if (next.rooms > next.adults) return;

        onChange(next);
    };

    const displayText = simpleMode
        ? t('guests.displayTextSimple', '{adults} Hành khách').replace('{adults}', String(value.adults))
        : t('guests.displayText', '{adults} Người lớn, {children} Trẻ em, {rooms} Phòng')
            .replace('{adults}', String(value.adults))
            .replace('{children}', String(value.children))
            .replace('{rooms}', String(value.rooms));

    const rows = simpleMode
        ? [
            { key: 'adults' as const, label: t('guests.passengers', 'Hành khách'), desc: t('guests.adultsDesc', 'Từ 12 tuổi trở lên'), min: 1, max: 10 },
        ]
        : [
            { key: 'adults' as const, label: t('guests.adults', 'Người lớn'), desc: t('guests.adultsDesc', 'Từ 12 tuổi trở lên'), min: 1, max: 10 },
            { key: 'children' as const, label: t('guests.children', 'Trẻ em'), desc: t('guests.childrenDesc', '0 – 11 tuổi'), min: 0, max: 6 },
            { key: 'rooms' as const, label: t('guests.rooms', 'Phòng'), desc: t('guests.roomsDesc', 'Tối đa 5 phòng'), min: 1, max: 5 },
        ];

    const content = (
        <div className={styles.popoverContent}>
            {rows.map(({ key, label, desc, min, max }) => (
                <div key={key} className={styles.row}>
                    <div className={styles.rowInfo}>
                        <span className={styles.rowLabel}>{label}</span>
                        <span className={styles.rowDesc}>{desc}</span>
                    </div>
                    <div className={styles.counter}>
                        <button
                            className={styles.counterBtn}
                            disabled={value[key] <= min}
                            onClick={() => update(key, -1)}
                        >
                            −
                        </button>
                        <span className={styles.counterValue}>{value[key]}</span>
                        <button
                            className={styles.counterBtn}
                            disabled={value[key] >= max}
                            onClick={() => update(key, +1)}
                        >
                            +
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <Popover content={content} trigger="click" placement="bottomLeft">
            <div className={styles.selectorTrigger}>
                <span className={`material-symbols-outlined ${styles.icon}`}>group</span>
                <span className={styles.text}>{displayText}</span>
                <span className={`material-symbols-outlined ${styles.arrow}`}>expand_more</span>
            </div>
        </Popover>
    );
};

export default GuestSelector;
