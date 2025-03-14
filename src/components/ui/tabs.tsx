"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// Note: You need to install @radix-ui/react-tabs by running:
// npm install @radix-ui/react-tabs

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
    defaultValue?: string;
    value?: string;
    onValueChange?: (value: string) => void;
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
    ({ className, defaultValue, value, onValueChange, children, ...props }, ref) => {
        const [internalValue, setInternalValue] = React.useState(value || defaultValue || "");

        React.useEffect(() => {
            if (value !== undefined) {
                setInternalValue(value);
            }
        }, [value]);

        const handleValueChange = React.useCallback((newValue: string) => {
            if (value === undefined) {
                setInternalValue(newValue);
            }
            onValueChange?.(newValue);
        }, [value, onValueChange]);

        return (
            <div ref={ref} className={className} {...props}>
                {React.Children.map(children, child => {
                    if (!React.isValidElement(child)) return child;

                    if (child.type === TabsList) {
                        return React.cloneElement(child as React.ReactElement<any>, {
                            "data-selected-tab": internalValue,
                            "data-on-select": handleValueChange,
                        });
                    }

                    if (child.type === TabsContent) {
                        const childValue = (child.props as any).value;
                        return React.cloneElement(child as React.ReactElement<any>, {
                            "data-selected-tab": internalValue,
                            "data-is-selected": childValue === internalValue,
                        });
                    }

                    return child;
                })}
            </div>
        );
    }
);
Tabs.displayName = "Tabs";

interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
    "data-selected-tab"?: string;
    "data-on-select"?: (value: string) => void;
}

const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
    ({ className, children, "data-selected-tab": selectedTab, "data-on-select": onSelect, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
                    className
                )}
                role="tablist"
                {...props}
            >
                {React.Children.map(children, child => {
                    if (!React.isValidElement(child) || child.type !== TabsTrigger) return child;

                    const childValue = (child.props as any).value;
                    return React.cloneElement(child as React.ReactElement<any>, {
                        "data-is-selected": childValue === selectedTab,
                        "data-on-select": onSelect,
                    });
                })}
            </div>
        );
    }
);
TabsList.displayName = "TabsList";

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    value: string;
    "data-is-selected"?: boolean;
    "data-on-select"?: (value: string) => void;
}

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
    ({ className, value, children, "data-is-selected": isSelected, "data-on-select": onSelect, ...props }, ref) => {
        return (
            <button
                ref={ref}
                role="tab"
                aria-selected={isSelected}
                data-state={isSelected ? "active" : "inactive"}
                onClick={() => onSelect?.(value)}
                className={cn(
                    "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
                    className
                )}
                {...props}
            >
                {children}
            </button>
        );
    }
);
TabsTrigger.displayName = "TabsTrigger";

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
    value: string;
    "data-selected-tab"?: string;
    "data-is-selected"?: boolean;
}

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
    ({ className, children, value, "data-selected-tab": selectedTab, "data-is-selected": isSelected, ...props }, ref) => {
        if (value !== selectedTab) return null;

        return (
            <div
                ref={ref}
                role="tabpanel"
                data-state={isSelected ? "active" : "inactive"}
                className={cn(
                    "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);
TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent };