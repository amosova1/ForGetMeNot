import {useState} from "react";

interface SearchBarProps {
    setSuggestions?: React.Dispatch<React.SetStateAction<string>>;
    placeholder?: string;
    url?: string;
}

export default function SearchBar({setSuggestions, placeholder, url}: SearchBarProps) {
    const [query, setQuery] = useState<string>("");
    const [items, setItems] = useState<string[]>([]);
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;
        setQuery(input);

        if (input.length > 0) {
            setIsOpen(true);
            try {

                const response = await fetch(`/api/${url}?query=${input}`);

                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }

                const data = await response.json();
                setItems(data);
            } catch (error) {
                console.error("Error fetching authors:", error);
            }
        } else {
            if (setSuggestions != null) {
                setSuggestions('')
            }

            setIsOpen(false);
        }
    };

    const handleClick = (selectedItem: string) => {
        console.log(selectedItem)
        if (setSuggestions != null) {
            setSuggestions(selectedItem.trim());
            setQuery(selectedItem.trim());
            setIsOpen(false);
        }
    };

    return (
        <div className="relative">
            <div className="flex items-center pl-5 pr-5 pt-2 pb-2 bg-[var(--clr-surface-a20)] rounded-full">
                <input
                    type="text"
                    className="bg-transparent outline-none w-full"
                    placeholder={placeholder || "Search..."}
                    value={query}
                    onChange={handleChange}
                />
                <span className="flex">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-4 h-4 text-gray-600"
                    >
                        <path
                            fillRule="evenodd"
                            d="M12 16.5l-6-6h12l-6 6z"
                            clipRule="evenodd"
                        />
                    </svg>
                </span>
            </div>

            {isOpen && (
                <div className="mt-2 rounded-xl shadow-md transition-all duration-300 ease-in-out">
                    <ul className="max-h-60 overflow-y-auto">
                        {items.length > 0 ? (
                            items.map((item, index) => (
                                <li
                                    key={index}
                                    className="p-2 cursor-pointer hover:bg-gray-200"
                                    onClick={() => handleClick(item)}
                                >
                                    {item}
                                </li>
                            ))
                        ) : (
                            <li className="px-4 py-2 text-gray-500">No results found</li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}
