import { useEffect, useState } from "react";
import Select from "react-select";

interface Specialty {
    specialty_id: string;
    name: string;
}

export default function SpecialtySelect({
    selectedSpecialties,
    setSelectedSpecialties,
}: any) {
    const [specialties, setSpecialties] = useState<Specialty[]>([]);

    useEffect(() => {
        const fetchSpecialties = async () => {
            try {
                const response = await fetch("/api/specialties");
                const data = await response.json();
                setSpecialties(data);
            } catch (err) {
                console.error("Failed to fetch specialties", err);
            }
        };
        fetchSpecialties();
    }, []);

    const handleSpecialtyChange = (selectedOptions: any) => {
        setSelectedSpecialties(selectedOptions);
    };

    const options = specialties.map((spec) => ({
        value: spec.specialty_id,
        label: spec.name,
    }));

    const customStyles = {
        control: (provided: any, state: any) => ({
            ...provided,
            backgroundColor: "transparent",
            borderColor: state.isFocused ? "#373F47" : "#373F47",
            boxShadow: state.isFocused ? "0 0 0 1px #373F47" : "none",
            "&:hover": {
                borderColor: "#373F47",
            },
            color: "#6A7280",
        }),
        menu: (provided: any) => ({
            ...provided,
            backgroundColor: "#373F47",
            border: "1px solid #373F47",
            color: "#6A7280",
        }),
        option: (provided: any, state: any) => ({
            ...provided,
            backgroundColor: state.isSelected
                ? "rgba(0, 0, 0, 0.6)"
                : "transparent",
            color: "#6A7280",
            "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.6)",
            },
        }),
        multiValue: (provided: any) => ({
            ...provided,
            backgroundColor: "rgba(0, 0, 0, 0.1)",
        }),
        multiValueLabel: (provided: any) => ({
            ...provided,
            color: "#6A7280",
        }),
        multiValueRemove: (provided: any) => ({
            ...provided,
            color: "#6A7280",
            "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.2)",
                color: "#6A7280",
            },
        }),
        placeholder: (provided: any) => ({
            ...provided,
            color: "#6A7280",
        }),
    };

    return (
        <div className="w-full">
            <label className="w-full flex items-center gap-2">
                <Select
                    isMulti
                    options={options}
                    closeMenuOnSelect={false}
                    placeholder={"Selecione as especialidades"}
                    onChange={handleSpecialtyChange}
                    className="w-full"
                    classNamePrefix="bg-gray-300"
                    styles={customStyles}
                />
            </label>
        </div>
    );
}
