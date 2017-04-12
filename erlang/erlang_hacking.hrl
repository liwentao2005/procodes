-ifndef(ERLANG_HACKING_HRL).
-define(ERLANG_HACKING_HRL, true).

-ifndef(PRINT).
-define(PRINT(Var), io:format("DEBUG: ~p:~p~n", [??Var, Var])).
-endif.

-ifndef(TIMEON).
%% Yes, these need to be on a single line to work...
-define(TIMEON, erlang:put(debug_timer, [now()|case erlang:get(debug_timer) == undefined of true -> []; false -> erlang:get(debug_timer) end])).
-define(TIMEOFF(Var), io:format("~s :: ~10.2f ms : ~p~n", [string:copies(" ", length(erlang:get(debug_timer))), (timer:now_diff(now(), hd(erlang:get(debug_timer)))/1000), Var]), erlang:put(debug_timer, tl(erlang:get(debug_timer)))).
-endif.

-endif.
