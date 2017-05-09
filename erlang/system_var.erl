-module(system_var).


-export([co_var/3,ci_var/4]).

co_var(Key, Module, _Var) ->
    case get(Key) of
        undefined ->
            case is_module_initialized(Module) of
                true ->
                    io:format("~w~n", ["co_var error!"]),
                    error;
                _ ->
                    %% run_bind_module_date(Module),
                    %% co_var(Key,Module,Var)
                    origin
            end;
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

is_module_initialized(Module) ->
    case get(module_initialized) of
        undefined ->
            false;
        L ->
            lists:member(Module, L)
    end.
