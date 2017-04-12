-module(system_var).


-export([co_var/3,ci_var/4]).

co_var(Key, _Module, _Var) ->
    case get(Key) of
        undefined ->
            original_data;
        {checked_out, _} ->
            error;
        MV ->
            put(Key, {checked_out, MV}),
            MV
    end.

ci_var(Key, _Module, _Var, MV) ->
    case put(Key, MV) of
        {checked_out, _} ->
            ok;
        undefined ->
            ok;
        _Err ->
            error
    end,
    ok.
