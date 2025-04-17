import React from 'react';

interface TableProps {
    data: Array<Record<string, any>>;
    columns: string[];
}

export const Table: React.FC<TableProps> = ({ data, columns }) => {
    return (
        <div className={'overflow-x-auto max-w-full'}>
            <table className={'min-w-full table-auto border-collapse shadow-md rounded-lg'}>
                <thead className={'bg-[var(--clr-surface-tonal-a10)]'}>
                <tr>
                    {columns.map((column, index) => (
                        <th
                            key={index}
                            className={'px-4 py-2 text-left font-semibold border-b'}
                        >
                            {column}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {data.map((row, rowIndex) => (
                    <tr
                        key={rowIndex}
                        className={rowIndex % 2 === 0 ? 'bg-[var(--clr-surface-tonal-a40)]' : 'bg-[var(--clr-surface-tonal-a30)]'}
                    >
                        {columns.map((column, colIndex) => (
                            <td
                                key={colIndex}
                                className={'px-4 py-2  border-b'}
                            >
                                {row[column]}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>

    );
};
