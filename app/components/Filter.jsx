import React from 'react';
import { useNavigate, useLocation, useSearchParams } from '@remix-run/react';
import { Checkbox } from '~/components/checkbox';
import { getFilterLink, getAppliedFilterLink } from '~/lib/filter';

export function Filter({ label, options, appliedFilters, onRemoveFilter }) {
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const location = useLocation();

    const isChecked = (option) =>
        appliedFilters.some((filter) => JSON.stringify(filter.filter) === JSON.stringify(option));

    const handleCheckedChange = (option, checked) => {
        if (checked) {
            const link = getFilterLink(option, params, location);
            navigate(link);
        } else {
            const filter = appliedFilters.find(
                (filter) => JSON.stringify(filter.filter) === JSON.stringify(option)
            );
            if (filter) {
                const link = getAppliedFilterLink(filter, params, location);
                navigate(link);
            }
        }
    };

    return (
        <div className="filter">
            <h4>{label}</h4>
            {options.map((option) => (
                <div key={option.label} className="filter-item">
                    <Checkbox
                        checked={isChecked(option)}
                        onCheckedChange={(checked) => handleCheckedChange(option, checked)}
                        label={option.label}
                    />
                    <span>({option.count})</span>
                </div>
            ))}
        </div>
    );
}
