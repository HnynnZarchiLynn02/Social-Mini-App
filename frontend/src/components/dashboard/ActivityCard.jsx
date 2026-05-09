export const ActivityCard = ({ post, onClick }) => (
    <div 
        onClick={onClick}
        className="group bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-blue-400 transition-all cursor-pointer flex flex-col md:flex-row items-center gap-6"
    >
        <img 
            src={post.user?.avatar || `https://ui-avatars.com/api/?name=${post.user?.username}&background=eff6ff&color=2563eb`} 
            className="w-16 h-16 rounded-2xl object-cover shadow-inner" alt="avatar"
        />
        <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-slate-900 text-lg">{post.user?.username}</span>
                <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-bold uppercase border border-blue-100">You</span>
            </div>
            <p className="text-slate-600 line-clamp-2 italic">"{post.content}"</p>
        </div>
        <div className="flex items-center gap-8 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100 group-hover:bg-blue-50 transition-colors">
            <div className="text-center">
                <div className="text-xl font-black text-slate-800">{post.like_count || 0}</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase">Likes</div>
            </div>
            <div className="text-center border-l border-slate-200 pl-8">
                <div className="text-xl font-black text-slate-800">{post.comments?.length || 0}</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase">Comments</div>
            </div>
        </div>
    </div>
);