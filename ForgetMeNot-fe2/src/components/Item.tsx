type ItemProps = {
    data: any;
    number: number;
    onClick: (num: number) => void;
    publicItem?: boolean,
};

export function Item({ data, number, onClick, publicItem }: ItemProps) {
    return (
        <div className={'relative flex justify-space w-full h-full gap-4 max-w-[800px] p-6 bg-[var(--clr-surface-a20)] rounded-xl'}
             onClick={() => onClick(number)}
        >
            <img className={'w-[90px] rounded-xl'} alt={'sdf'} src={'./src/assets/book-icon.svg'}/>

            <div className={'flex flex-col justify-between'}>
                <div>{data.title}</div>
                <div>{data.author}</div>
                <div>{data.link}</div>
            </div>

            {publicItem !== null && publicItem && <div>{data.username}</div>}

            <>
                <div className={'absolute top-5 right-5'}>{data.section}</div>

                {data.tags && data.tags.length > 0 && (
                    <div className={'absolute bottom-5 right-5'}>
                        {data.tags.map((tag: string, index: number) => (
                            <span key={index}>#{tag} </span>
                            ))}
                    </div>
                )}
            </>
        </div>
    );
}