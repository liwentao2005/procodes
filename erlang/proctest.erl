-module(proctest).
-export([start_proc/1, get_first_tac/4, get_tac/2, tac/0, tac/4]).
-export([get_config_value/1]).

%% ----------------------------
tac() ->
    io:format("tac(TaPerEnB, Overlap, OverlapGroupSize, EnbId).~n", []),
    ok.

tac(TaPerEnB, Overlap, OverlapGroupSize, EnbId) ->
    io:format("TaPerEnB: ~w, Overlap: ~w, OverlapGroupSize: ~w, EnbId: ~w~n", [TaPerEnB, Overlap, OverlapGroupSize, EnbId]),
    FirstTac = get_first_tac(TaPerEnB, Overlap, OverlapGroupSize, EnbId),
    get_tac(FirstTac, TaPerEnB).

%% get first
get_first_tac(TaPerEnB, Overlap, OverlapGroupSize, EnbId) ->
    NbrTacPerOverlappingGroup = TaPerEnB + (TaPerEnB - Overlap) * (OverlapGroupSize - 1),
    EnbOffset = EnbId - 1, %% EnBStart = 1
    1 + (EnbOffset div OverlapGroupSize) * NbrTacPerOverlappingGroup + (EnbOffset rem OverlapGroupSize) * (TaPerEnB - Overlap). %% TaStart
%% get Tac
%% get Tac
get_tac(TaStart, NbrOfTa) ->
    get_tac_help(TaStart, TaStart + NbrOfTa -1, []).
    
get_tac_help(LastTa, LastTa, TacList) ->
    io:format("~w~n", [lists:reverse([LastTa | TacList])]);
get_tac_help(Ta, LastTa, TacList) ->
    get_tac_help(Ta + 1, LastTa, [Ta | TacList]).
%% ----------------------------

start_proc(Hostname) ->
    BeamIndex = 11,
    IndexPos = string:rchr(atom_to_list(Hostname), $-),
    case IndexPos of
        %% Hostname foramt 1:'dallas', for aat
        0 ->
            10;
        _ ->
            IndexStr = string:substr(atom_to_list(Hostname), IndexPos),
            IndexNum = tl(IndexStr),
            io:format("IndexNum:~w~n", [IndexNum]),
            if
                erlang:length(IndexNum) > 0 ->
                    try
                        %% Hostname foramt 2:'dallas-12', standard 
                        HostIndex = list_to_integer(IndexNum),
                        io:format("~w~n", [HostIndex]),
                        case HostIndex of
                            1 ->
                                case BeamIndex of
                                    1 -> 1;
                                    _ -> 11
                                end;
                            _ ->
                                12
                        end
                    catch
                        %% Hostname format 3:'dallas-aat', for aat 
                        _:_ -> 13
                    end;
                %% Hostname format 4:'dallas-', maybe 
                true ->
                    14
            end            
        end.

get_config_value(Key) ->
    case {false , key, true} of
        {false, true, true} ->
            io:format("1~w~n", [Key]),
            1;
        _ ->
            io:format("2~w~n", [Key]),
            ok
    end,
    case {ok, Key} of
        {ok, true} ->
            io:format("3~w~n", [Key]),
            2;
        {ok, false} ->
            io:format("4~w~n", [Key]),
            no
    end.
