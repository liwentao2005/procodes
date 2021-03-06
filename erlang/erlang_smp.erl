%%%
%%% mpstat -P ALL 2 10
%%%

-module(erlang_smp).
-export([start_proc/1]).

start_proc(Num) ->
    case Num =:= 0 of
        true ->
            ok;
        false ->
            spawn(fun() -> loop() end),
            start_proc(Num - 1)
    end.

loop() ->
    loop().
