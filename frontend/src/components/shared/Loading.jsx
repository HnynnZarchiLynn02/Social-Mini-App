export const Loading = ({ message = "Loading..." }) => (
    <div className="flex flex-col items-center justify-center p-10 gap-3">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 font-medium animate-pulse">{message}</p>
    </div>
);